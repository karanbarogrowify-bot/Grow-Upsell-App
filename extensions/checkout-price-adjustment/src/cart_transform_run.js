/** @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput */
/** @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult */

const NO_CHANGES = { operations: [] };

/**
 * Increases the price of cart lines whose product matches an active rule.
 *
 * Configuration (cart transform metafield $app.checkoutPriceAdjustments):
 * - rules: active rules with productIds and percentage
 *
 * @param {CartTransformRunInput} input
 * @returns {CartTransformRunResult}
 */
export function cartTransformRun(input) {
  const configuration = input.cartTransform?.configuration?.jsonValue;

  if (!configuration || typeof configuration !== "object") {
    return NO_CHANGES;
  }

  const rules = configuration.rules;

  if (!Array.isArray(rules) || rules.length === 0) {
    return NO_CHANGES;
  }

  const operations = [];

  for (const line of input.cart.lines) {
    const merchandise = line.merchandise;
    const productId =
      merchandise && "product" in merchandise
        ? merchandise.product?.id
        : null;
    const unitAmount = Number(line.cost?.amountPerQuantity?.amount);

    if (!productId || !Number.isFinite(unitAmount) || unitAmount <= 0) {
      continue;
    }

    const matchingRule = rules.find(
      (rule) =>
        rule &&
        rule.status === "Active" &&
        Array.isArray(rule.productIds) &&
        rule.productIds.includes(productId) &&
        Number(rule.percentage) > 0 &&
        Number(rule.percentage) <= 100,
    );

    if (!matchingRule) {
      continue;
    }

    const adjustedAmount =
      unitAmount * (1 + Number(matchingRule.percentage) / 100);

    operations.push({
      lineUpdate: {
        cartLineId: line.id,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: adjustedAmount.toFixed(2),
            },
          },
        },
      },
    });
  }

  return operations.length > 0 ? { operations } : NO_CHANGES;
}
