import { useCallback, useState } from "react";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import useDiscounts from "../hooks/useDiscounts";
import useUpsells from "../hooks/useUpsells";
import {
  loadDashboardMessages,
  syncMessagesMetafields,
} from "../services/messages.server";
import { loadDashboardDiscounts } from "../services/discounts.server";
import { loadDashboardUpsells } from "../services/upsells.server";
import { loadThankYouCampaigns } from "../services/thankyou.server";

/* global process */

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const [messages, discounts, upsells, thankYouCampaigns] = await Promise.all([
    loadDashboardMessages(admin, session.shop),
    loadDashboardDiscounts(admin),
    loadDashboardUpsells(admin),
    loadThankYouCampaigns(admin),
  ]);
  await syncMessagesMetafields(admin, session.shop, messages);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: session.shop,
    messages,
    discounts,
    upsells,
    thankYouCampaigns,
  };
};

export default function App() {
  const {
    apiKey,
    shop,
    messages: initialMessages,
    discounts: initialDiscounts,
    upsells: initialUpsells,
    thankYouCampaigns: initialThankYouCampaigns,
  } = useLoaderData();
  const syncDiscounts = useCallback(async (nextDiscounts) => {
    try {
      await fetch("/api/checkout-discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, discounts: nextDiscounts }),
      });
    } catch (error) {
      console.error("Failed to sync checkout discounts:", error);
    }
  }, [shop]);
  const syncUpsells = useCallback(async (nextUpsells) => {
  const response = await fetch("/api/checkout-upsells", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ upsells: nextUpsells }),
  });

  const result = await response.json().catch(() => null);

    if (!response.ok || !result?.ok) {
      throw new Error(
        result?.error || `Failed to save checkout upsells (${response.status})`,
      );
    }

    return result;
  }, [shop]);
  const discountState = useDiscounts({ initialDiscounts, onChange: syncDiscounts });
  const upsellState = useUpsells({ initialUpsells, onChange: syncUpsells });
  const [messages, setMessages] = useState(initialMessages);

  const [thankYouCampaigns, setThankYouCampaigns] = useState(
    initialThankYouCampaigns,
  );

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app/dashboard">Dashboard</s-link>
        <s-link href="/app/messages">Checkout Messages</s-link>
        <s-link href="/app/discounts">Discounts</s-link>
        <s-link href="/app/upsells">Upsells</s-link>
        <s-link href="/app/analytics">Analytics</s-link>
        <s-link href="/app/settings">Settings</s-link>
      </s-app-nav>

      <Outlet
        context={{
          messages,
          setMessages,
          shop,
          thankYouCampaigns,
          setThankYouCampaigns,
          ...discountState,
          ...upsellState,
        }}
      />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
