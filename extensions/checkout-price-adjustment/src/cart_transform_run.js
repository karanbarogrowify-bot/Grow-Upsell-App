// @ts-check

/**
 * @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput
 * @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult
 */

const NO_CHANGES = { operations: [] };

/**
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
    const productId = line.merchandise?.product?.id;
    const originalAmount = Number(line.cost.amountPerQuantity.amount);

    if (!productId || !Number.isFinite(originalAmount)) {
      continue;
    }

    const matchingRule = rules.find((rule) => {
      return (
        rule &&
        rule.status === "Active" &&
        Array.isArray(rule.productIds) &&
        rule.productIds.includes(productId) &&
        Number(rule.percentage) > 0 &&
        Number(rule.percentage) <= 100
      );
    });

    if (!matchingRule) {
      continue;
    }

    const percentage = Number(matchingRule.percentage);
    const adjustedAmount = Number(
      (originalAmount * (1 + percentage / 100)).toFixed(2),
    );

    operations.push({
      lineUpdate: {
        cartLineId: line.id,
        price: {
          adjustment: {
            fixedPricePerUnit: {
              amount: adjustedAmount,
            },
          },
        },
      },
    });
  }

  return operations.length > 0 ? { operations } : NO_CHANGES;
}
