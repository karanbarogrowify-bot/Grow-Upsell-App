import { authenticate } from "../shopify.server";
import {
  getActiveThankYouCampaigns,
  syncThankYouCampaignsMetafield,
} from "../services/thankyou.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...init.headers,
    },
  });
}

export async function loader() {
  return json({
    enabled: false,
    campaigns: [],
  });
}

export async function action({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return json(
      {
        ok: false,
        error: "Method not allowed",
      },
      {
        status: 405,
      },
    );
  }

  try {
    const { admin } = await authenticate.admin(request);

    const body = await request.json();

    const campaigns = Array.isArray(body.campaigns)
      ? body.campaigns
      : [];

    const savedCampaigns =
      await syncThankYouCampaignsMetafield(
        admin,
        campaigns,
      );

    const activeCampaigns =
      getActiveThankYouCampaigns(savedCampaigns);

    return json({
      ok: true,
      enabled: activeCampaigns.length > 0,
      campaigns: savedCampaigns,
      activeCampaigns,
    });
  } catch (error) {
    console.error(
      "Failed to save Thank You campaigns:",
      error,
    );

    return json(
      {
        ok: false,
        error:
          error?.message ||
          "Failed to save Thank You campaigns",
      },
      {
        status: 500,
      },
    );
  }
}