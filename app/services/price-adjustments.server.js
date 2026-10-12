import {
  APP_METAFIELD_NAMESPACE,
  readShopJsonMetafield,
  setShopJsonMetafields,
} from "./shop-metafields.server";

export const PRICE_ADJUSTMENTS_METAFIELD = {
  namespace: APP_METAFIELD_NAMESPACE,
  key: "priceAdjustments",
};

export const CHECKOUT_PRICE_ADJUSTMENTS_METAFIELD = {
  namespace: APP_METAFIELD_NAMESPACE,
  key: "checkoutPriceAdjustments",
};

function normalizePriceAdjustment(rule) {
  return {
    id: String(rule.id || ""),
    title: String(rule.title || ""),
    status: rule.status === "Active" ? "Active" : "Draft",
    targetType: rule.targetType === "tag" ? "tag" : "collection",
    collectionIds: Array.isArray(rule.collectionIds)
      ? rule.collectionIds.map(String)
      : [],
    productTag: String(rule.productTag || "").trim(),
    percentage: Math.max(0, Number(rule.percentage) || 0),
    message: String(rule.message || "").trim(),
  };
}

export function getActivePriceAdjustments(rules = []) {
  return rules
    .map(normalizePriceAdjustment)
    .filter(
      (rule) =>
        rule.status === "Active" &&
        rule.percentage > 0 &&
        rule.percentage <= 100 &&
        rule.message.length > 0 &&
        (rule.targetType === "tag"
          ? rule.productTag.length > 0
          : rule.collectionIds.length > 0),
    );
}

export async function loadDashboardPriceAdjustments(admin) {
  const rules = await readShopJsonMetafield(
    admin,
    PRICE_ADJUSTMENTS_METAFIELD,
    [],
  );

  return Array.isArray(rules) ? rules.map(normalizePriceAdjustment) : [];
}

/**
 * Finds product IDs matching a rule using Shopify's Admin GraphQL API.
 * Collection and tag searches are resolved server-side.
 */
async function getMatchingProductIds(admin, rule) {
  const productIds = new Set();
  let after = null;

  while (true) {
    const query = rule.targetType === "tag"
      ? "tag:" + JSON.stringify(rule.productTag)
      : rule.collectionIds
          .map((id) => "collection_id:" + id.split("/").pop())
          .join(" OR ");

    const response = await admin.graphql(
      `#graphql
        query MatchingProducts($first: Int!, $after: String, $query: String!) {
          products(first: $first, after: $after, query: $query) {
            nodes {
              id
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      {
        variables: {
          first: 250,
          after,
          query,
        },
      },
    );

    const body = await response.json();

    if (body.errors?.length) {
      throw new Error(
        body.errors.map((error) => error.message).join(", "),
      );
    }

    const connection = body.data?.products;

    if (!connection) {
      throw new Error("Shopify did not return matching products.");
    }

    for (const product of connection.nodes || []) {
      productIds.add(product.id);
    }

    if (!connection.pageInfo?.hasNextPage) break;

    after = connection.pageInfo.endCursor;
  }

  return [...productIds];
}

export async function syncPriceAdjustmentsMetafields(admin, rules = []) {
  const normalizedRules = rules.map(normalizePriceAdjustment);
  const activeRules = getActivePriceAdjustments(normalizedRules);

  const checkoutRules = [];

  for (const rule of activeRules) {
    const productIds = await getMatchingProductIds(admin, rule);

    checkoutRules.push({
      id: rule.id,
      title: rule.title,
      status: rule.status,
      percentage: rule.percentage,
      message: rule.message,
      targetType: rule.targetType,
      productIds,
    });
  }

  await setShopJsonMetafields(admin, [
    {
      ...PRICE_ADJUSTMENTS_METAFIELD,
      value: normalizedRules,
    },
    {
      ...CHECKOUT_PRICE_ADJUSTMENTS_METAFIELD,
      value: checkoutRules,
    },
  ]);

  return {
    rules: normalizedRules,
    activeRules: checkoutRules,
  };
}
