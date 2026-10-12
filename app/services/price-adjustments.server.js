
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

const CART_TRANSFORM_HANDLE = "checkout-price-adjustment";

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

async function fetchAllProductIds(admin, query, variables, getConnection) {
  const productIds = new Set();
  let after = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await admin.graphql(query, {
      variables: { ...variables, first: 250, after },
    });

    const body = await response.json();

    if (body.errors?.length) {
      throw new Error(
        body.errors.map((error) => error.message).join(", "),
      );
    }

    const connection = getConnection(body.data);

    if (!connection) {
      return [...productIds];
    }

    for (const product of connection.nodes || []) {
      productIds.add(product.id);
    }

    hasNextPage = Boolean(connection.pageInfo?.hasNextPage);
    after = connection.pageInfo?.endCursor ?? null;
  }

  return [...productIds];
}

/**
 * Finds product IDs matching a rule using Shopify Admin GraphQL.
 */
async function getMatchingProductIds(admin, rule) {
  if (rule.targetType === "tag") {
    return fetchAllProductIds(
      admin,
      `#graphql
        query ProductsByTag($first: Int!, $after: String, $query: String!) {
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
      { query: `tag:${JSON.stringify(rule.productTag)}` },
      (data) => data?.products,
    );
  }

  const productIds = new Set();

  for (const collectionId of rule.collectionIds) {
    const ids = await fetchAllProductIds(
      admin,
      `#graphql
        query ProductsByCollection($id: ID!, $first: Int!, $after: String) {
          collection(id: $id) {
            products(first: $first, after: $after) {
              nodes {
                id
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `,
      { id: collectionId },
      (data) => data?.collection?.products,
    );

    ids.forEach((id) => productIds.add(id));
  }

  return [...productIds];
}

/**
 * Registers the Cart Transform if necessary and synchronizes its rules.
 */
async function syncCartTransformConfiguration(admin, checkoutRules) {
  const configuration = {
    rules: checkoutRules,
  };

  const metafieldInput = {
    namespace: CHECKOUT_PRICE_ADJUSTMENTS_METAFIELD.namespace,
    key: CHECKOUT_PRICE_ADJUSTMENTS_METAFIELD.key,
    type: "json",
    value: JSON.stringify(configuration),
  };

  // Find an existing Cart Transform belonging to this app.
  const existingResponse = await admin.graphql(
    `#graphql
      query GetCartTransforms {
        cartTransforms(first: 10) {
          nodes {
            id
            functionId
            metafield(
              namespace: "$app"
              key: "checkoutPriceAdjustments"
            ) {
              id
            }
          }
        }
      }
    `,
  );

  const existingBody = await existingResponse.json();

  if (existingBody.errors?.length) {
    throw new Error(
      existingBody.errors.map((error) => error.message).join(", "),
    );
  }

  const transforms = existingBody.data?.cartTransforms?.nodes || [];

  // cartTransforms only returns this app's transforms. Prefer the one
  // already configured, otherwise reuse any existing one.
  const existingTransform =
    transforms.find((transform) => transform.metafield?.id) ||
    transforms[0];

  if (existingTransform) {
    const updateResponse = await admin.graphql(
      `#graphql
        mutation UpdateCartTransformConfiguration(
          $metafields: [MetafieldsSetInput!]!
        ) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              key
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          metafields: [
            {
              ...metafieldInput,
              ownerId: existingTransform.id,
            },
          ],
        },
      },
    );

    const updateBody = await updateResponse.json();
    const payload = updateBody.data?.metafieldsSet;

    const errors = [
      ...(updateBody.errors || []).map((error) => error.message),
      ...(payload?.userErrors || []).map((error) => error.message),
    ];

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return {
      success: true,
      action: "updated",
      cartTransformId: existingTransform.id,
    };
  }

  const createResponse = await admin.graphql(
    `#graphql
      mutation CreateCartTransform(
        $functionHandle: String!
        $metafields: [MetafieldInput!]!
      ) {
        cartTransformCreate(
          functionHandle: $functionHandle
          metafields: $metafields
        ) {
          cartTransform {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        functionHandle: CART_TRANSFORM_HANDLE,
        metafields: [metafieldInput],
      },
    },
  );

  const createBody = await createResponse.json();
  const payload = createBody.data?.cartTransformCreate;

  const errors = [
    ...(createBody.errors || []).map((error) => error.message),
    ...(payload?.userErrors || []).map((error) => error.message),
  ];

  if (errors.length) {
    throw new Error(errors.join(", "));
  }

  if (!payload?.cartTransform?.id) {
    throw new Error("Shopify did not return a Cart Transform ID.");
  }

  return {
    success: true,
    action: "created",
    cartTransformId: payload.cartTransform.id,
  };
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

  // Keep the existing shop-level dashboard metafields.
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

  // Also register/update the actual Cart Transform configuration.
  const cartTransform = await syncCartTransformConfiguration(
    admin,
    checkoutRules,
  );

  return {
    rules: normalizedRules,
    activeRules: checkoutRules,
    cartTransform,
  };
}
