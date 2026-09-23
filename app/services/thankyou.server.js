import {
  APP_METAFIELD_NAMESPACE,
  readShopJsonMetafield,
  setShopJsonMetafields,
} from "./shop-metafields.server";

export const THANK_YOU_CAMPAIGNS_METAFIELD = {
  namespace: APP_METAFIELD_NAMESPACE,
  key: "thankYouCampaigns",
};

export async function loadThankYouCampaigns(admin) {
  const campaigns = await readShopJsonMetafield(
    admin,
    THANK_YOU_CAMPAIGNS_METAFIELD,
    [],
  );

  return Array.isArray(campaigns) ? campaigns : [];
}

export async function syncThankYouCampaignsMetafield(
  admin,
  campaigns = [],
) {
  const normalizedCampaigns = Array.isArray(campaigns)
    ? campaigns
    : [];

  await setShopJsonMetafields(admin, [
    {
      ...THANK_YOU_CAMPAIGNS_METAFIELD,
      value: normalizedCampaigns,
    },
  ]);

  return normalizedCampaigns;
}

export function getActiveThankYouCampaigns(campaigns = []) {
  return campaigns.filter(
    (campaign) => campaign.status === "Active",
  );
}