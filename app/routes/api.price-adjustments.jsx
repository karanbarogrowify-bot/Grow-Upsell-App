import { authenticate } from "../shopify.server";
import {
  loadDashboardPriceAdjustments,
  syncPriceAdjustmentsMetafields,
} from "../services/price-adjustments.server";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const rules = await loadDashboardPriceAdjustments(admin);

    return Response.json({ ok: true, rules });
  } catch (error) {
    console.error("Failed to load price adjustments:", error);

    return Response.json(
      { ok: false, error: "Failed to load price adjustment rules." },
      { status: 500 },
    );
  }
}

export async function action({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { ok: false, error: "Method not allowed." },
      { status: 405 },
    );
  }

  try {
    const { admin } = await authenticate.admin(request);
    const body = await request.json();

    if (!Array.isArray(body.rules)) {
      return Response.json(
        { ok: false, error: "Rules must be provided as an array." },
        { status: 400 },
      );
    }

    if (body.rules.length > 100) {
      return Response.json(
        { ok: false, error: "You can save up to 100 rules." },
        { status: 400 },
      );
    }

    const seenIds = new Set();

    for (const rule of body.rules) {
      if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
        return Response.json(
          { ok: false, error: "Invalid rule data." },
          { status: 400 },
        );
      }

      if (!rule.id || typeof rule.id !== "string" || !rule.id.trim()) {
        return Response.json(
          { ok: false, error: "Every rule must have an ID." },
          { status: 400 },
        );
      }

      if (seenIds.has(rule.id)) {
        return Response.json(
          { ok: false, error: "Rule IDs must be unique." },
          { status: 400 },
        );
      }

      seenIds.add(rule.id);

      const percentage = Number(rule.percentage);

      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
        return Response.json(
          { ok: false, error: "Percentage must be between 0 and 100." },
          { status: 400 },
        );
      }

      if (!["collection", "tag"].includes(rule.targetType)) {
        return Response.json(
          { ok: false, error: "Target type must be collection or tag." },
          { status: 400 },
        );
      }

      if (
        rule.targetType === "collection" &&
        (!Array.isArray(rule.collectionIds) || rule.collectionIds.length === 0)
      ) {
        return Response.json(
          { ok: false, error: "Select at least one collection." },
          { status: 400 },
        );
      }

      if (
        rule.targetType === "tag" &&
        (typeof rule.productTag !== "string" || !rule.productTag.trim())
      ) {
        return Response.json(
          { ok: false, error: "Enter a product tag." },
          { status: 400 },
        );
      }

      if (typeof rule.title !== "string" || !rule.title.trim()) {
        return Response.json(
          { ok: false, error: "Every rule needs a title." },
          { status: 400 },
        );
      }

      if (typeof rule.message !== "string" || !rule.message.trim()) {
        return Response.json(
          { ok: false, error: "Every rule needs a checkout message." },
          { status: 400 },
        );
      }

      if (!["Active", "Draft"].includes(rule.status)) {
        return Response.json(
          { ok: false, error: "Status must be Active or Draft." },
          { status: 400 },
        );
      }
    }

    const result = await syncPriceAdjustmentsMetafields(
      admin,
      body.rules,
    );

    return Response.json({
      ok: true,
      rules: result.rules,
    });
  } catch (error) {
    console.error("Failed to save price adjustments:", error);

    return Response.json(
      {
        ok: false,
        error: error?.message || "Failed to save price adjustment rules.",
      },
      { status: 500 },
    );
  }
}
