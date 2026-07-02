import { json } from "react-router";
import { authenticate } from "../../../shopify.server";

export const action = async ({ request }) => {
  // This endpoint creates a new checkout (Storefront API) with the provided variant and returns the checkout URL.
  // Requires SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable to be set.

  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const { variantId, quantity = 1 } = body;
  if (!variantId) {
    return new Response(JSON.stringify({ error: "variantId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!storefrontToken) {
    return new Response(JSON.stringify({ error: "Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN env var" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const mutation = `mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: { lineItems: $lineItems }) {
      checkout { id webUrl }
      userErrors { field message }
    }
  }`;

  const variables = { lineItems: [{ variantId, quantity }] };

  const res = await fetch(`https://${shop}/api/2026-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  const result = await res.json();
  if (result?.data?.checkoutCreate?.userErrors?.length) {
    return new Response(JSON.stringify({ errors: result.data.checkoutCreate.userErrors }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const checkout = result?.data?.checkoutCreate?.checkout || null;
  return new Response(JSON.stringify({ checkout }), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const loader = async () => {
  return json({ ok: true });
};
