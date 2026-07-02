# Checkout UI Extension (stub)

This directory contains a stub for a Shopify Checkout UI Extension that will
render upsell blocks inside the checkout (Shopify Plus target).

Notes

- This is a scaffold only. Use the Shopify CLI to create a proper Checkout UI
  Extension project and register it with your app. For example:

  ```bash
  shopify extension create checkout_ui_extension
  ```

- The real extension should use `@shopify/checkout-ui-extensions-react` and the
  extension SDK to interact with the checkout UI (add line items, listen for
  cart changes, etc.).
- The extension will call the app backend endpoint at
  `/api/checkout/add-line-item` to create a checkout or return a checkout URL
  (this scaffold uses the Storefront API via an access token).

Implementation checklist

- Create extension with Shopify CLI
- Implement UI using Checkout UI Extensions SDK
- Wire Add/Remove actions to server endpoint or extension client APIs
- Register extension in `shopify.app.toml` and deploy
