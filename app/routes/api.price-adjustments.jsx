
import { authenticate } from "../shopify.server";
import {
  getPriceAdjustmentSyncStatus,
  loadDashboardPriceAdjustments,
  syncPriceAdjustmentsMetafields,
} from "../services/price-adjustments.server";

function json(data, init = {}) {
  return Response.json(data, init);
}

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  try {
    const [rules, sync] = await Promise.all([
      loadDashboardPriceAdjustments(admin),
      getPriceAdjustmentSyncStatus(admin),
    ]);

    return json({ ok: true, rules, sync });
  } catch (error) {
    console.error("Failed to load price adjustments:", error);

    return json(
      {
        ok: false,
        error: error.message || "Failed to load price adjustments.",
      },
      { status: 500 },
    );
  }
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return json(
      { ok: false, error: "Method not allowed." },
      { status: 405 },
    );
  }

  try {
    const body = await request.json();

    if (!Array.isArray(body.rules)) {
      return json(
        { ok: false, error: "Rules must be an array." },
        { status: 400 },
      );
    }

    if (body.rules.length > 100) {
      return json(
        { ok: false, error: "You can save a maximum of 100 rules." },
        { status: 400 },
      );
    }

    const ids = new Set();

    for (const rule of body.rules) {
      if (!rule.id || ids.has(String(rule.id))) {
        return json(
          {
            ok: false,
            error: "Every rule must have a unique ID.",
          },
          { status: 400 },
        );
      }

      ids.add(String(rule.id));

      const percentage = Number(rule.percentage);
      const targetType =
        rule.targetType === "tag" ? "tag" : rule.targetType;

      if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        return json(
          {
            ok: false,
            error: `Invalid percentage for "${rule.title || rule.id}".`,
          },
          { status: 400 },
        );
      }

      if (!["collection", "tag"].includes(targetType)) {
        return json(
          {
            ok: false,
            error: `Invalid target type for "${rule.title || rule.id}".`,
          },
          { status: 400 },
        );
      }

      if (
        targetType === "tag" &&
        !String(rule.productTag || "").trim()
      ) {
        return json(
          {
            ok: false,
            error: `Enter a product tag for "${rule.title || rule.id}".`,
          },
          { status: 400 },
        );
      }

      if (
        targetType === "collection" &&
        (!Array.isArray(rule.collectionIds) ||
          rule.collectionIds.length === 0)
      ) {
        return json(
          {
            ok: false,
            error: `Select a collection for "${rule.title || rule.id}".`,
          },
          { status: 400 },
        );
      }

      if (!String(rule.title || "").trim()) {
        return json(
          {
            ok: false,
            error: "Every rule needs a title.",
          },
          { status: 400 },
        );
      }

      if (!["Active", "Draft"].includes(rule.status)) {
        return json(
          {
            ok: false,
            error: `Invalid status for "${rule.title}".`,
          },
          { status: 400 },
        );
      }
    }

    const result = await syncPriceAdjustmentsMetafields(
      admin,
      body.rules,
    );

    const sync = await getPriceAdjustmentSyncStatus(admin);

    return json({
      ok: true,
      message: "Price adjustment rules saved and synchronized.",
      rules: result.rules,
      cartTransform: result.cartTransform,
      sync,
    });
  } catch (error) {
  console.error(
    "Failed to save price adjustments:",
        error?.stack || error,
    );

    return json(
        {
        ok: false,
        error: error?.message || "Failed to save price adjustments.",
        details: error?.cause?.message || null,
        },
        { status: 500 },
    );
  }
}
