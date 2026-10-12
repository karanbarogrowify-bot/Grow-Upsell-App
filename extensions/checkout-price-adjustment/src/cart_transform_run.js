
/** @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput */
/** @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult */

const NO_CHANGES = { operations: [] };

/**
 * Updates only the dedicated rush-charge variant.
 * Original product prices are never modified.
 *
 * Configuration must contain:
 * - rules: active rules with productIds and percentage
 * - feeVariantId: Shopify variant GID for the rush-charge product
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
  const feeVariantId = configuration.feeVariantId;

  if (!Array.isArray(rules) || !feeVariantId) {
    return NO_CHANGES;
  }

  let totalRushCharge = 0;
  let currencyCode = null;
  let feeLine = null;

  for (const line of input.cart.lines) {
    const merchandise = line.merchandise;

    if (!merchandise || !("id" in merchandise)) {
      continue;
    }

    // Identify the dedicated fee line.
    if (merchandise.id === feeVariantId) {
      feeLine = line;
      continue;
    }

    const productId = merchandise.product?.id;
    const unitAmount = Number(line.cost.amountPerQuantity.amount);
    const quantity = Number(line.quantity);

    if (
      !productId ||
      !Number.isFinite(unitAmount) ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
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

    const lineAmount = unitAmount * quantity;
    totalRushCharge += lineAmount * (Number(matchingRule.percentage) / 100);

    currencyCode ??= line.cost.amountPerQuantity.currencyCode;
  }

  // No fee line or no qualifying products: do not alter any price.
  if (!feeLine || !currencyCode || totalRushCharge <= 0) {
    return NO_CHANGES;
  }

  const feeUnitAmount = Number(totalRushCharge.toFixed(2));

  return {
    operations: [
      {
        lineUpdate: {
          cartLineId: feeLine.id,
          price: {
            adjustment: {
              fixedPricePerUnit: {
                amount: feeUnitAmount,
              },
            },
          },
        },
      },
    ],
  };
}
