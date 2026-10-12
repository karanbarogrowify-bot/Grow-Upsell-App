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

export async function syncPriceAdjustmentsMetafields(admin, rules = []) {
  const normalizedRules = rules.map(normalizePriceAdjustment);
  const activeRules = getActivePriceAdjustments(normalizedRules);

  await setShopJsonMetafields(admin, [
    {
      ...PRICE_ADJUSTMENTS_METAFIELD,
      value: normalizedRules,
    },
    {
      ...CHECKOUT_PRICE_ADJUSTMENTS_METAFIELD,
      value: activeRules,
    },
  ]);

  return {
    rules: normalizedRules,
    activeRules,
  };
}
