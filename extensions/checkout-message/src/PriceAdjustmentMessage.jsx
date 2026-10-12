import "@shopify/ui-extensions/preact";
import { render } from "preact";

const PRICE_ADJUSTMENTS_METAFIELD = {
  namespace: "$app",
  key: "checkoutPriceAdjustments",
};

export default async () => {
  render(<PriceAdjustmentMessage />, document.body);
};

function PriceAdjustmentMessage() {
  const productId = shopify.target.value?.merchandise?.product?.id;
  const rule = getPriceAdjustments().find(
    (item) =>
      Array.isArray(item.productIds) && item.productIds.includes(productId),
  );

  if (!productId || !rule?.message) return null;

  return (
    <s-text type="small" color="subdued">
      {rule.message}
    </s-text>
  );
}

function getPriceAdjustments() {
  const priceAdjustments = shopify.appMetafields.value.find(
    (appMetafield) =>
      appMetafield.target.type === "shop" &&
      appMetafield.metafield.namespace ===
        PRICE_ADJUSTMENTS_METAFIELD.namespace &&
      appMetafield.metafield.key === PRICE_ADJUSTMENTS_METAFIELD.key,
  );

  if (!priceAdjustments?.metafield?.value) return [];

  try {
    const rules = JSON.parse(priceAdjustments.metafield.value);

    return Array.isArray(rules)
      ? rules.filter((rule) => rule.status === "Active")
      : [];
  } catch (error) {
    console.error("Price adjustment metafield parse error", error);
    return [];
  }
}
