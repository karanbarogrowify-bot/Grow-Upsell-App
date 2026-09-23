import { useState } from "react";
import { useOutletContext } from "react-router";

const CAMPAIGN_TYPES = [
  {
    type: "nextPurchaseOffer",
    icon: "🎁",
    title: "Next Purchase Offer",
    description:
      "Give customers an exclusive offer for their next purchase.",
  },
  {
    type: "productRecommendations",
    icon: "🛍️",
    title: "Product Recommendations",
    description:
      "Show recommended products after the customer completes an order.",
  },
  {
    type: "reviewRequest",
    icon: "⭐",
    title: "Review Request",
    description:
      "Ask customers to share their experience or leave a review.",
  },
  {
    type: "referral",
    icon: "🤝",
    title: "Referral",
    description:
      "Encourage customers to refer friends and grow your customer base.",
  },
  {
    type: "survey",
    icon: "📋",
    title: "Post-Purchase Survey",
    description:
      "Collect feedback about the customer's shopping experience.",
  },
  {
    type: "firstOrderWelcome",
    icon: "🎉",
    title: "First Order Welcome",
    description:
      "Show a special welcome message to customers placing their first order.",
  },
];

const DEFAULT_CAMPAIGN = {
  id: "",
  type: "nextPurchaseOffer",
  title: "",
  status: "Draft",

  heading: "Thanks for your order!",
  description: "Enjoy 15% OFF your next purchase.",
  offerText: "Get 15% off your next order",

  discountCode: "",
  buttonText: "Shop Again",
  buttonUrl: "/collections/all",

  displayCondition: "all",
  minimumOrderValue: "",
};

export default function ThankYou() {

    const {
    thankYouCampaigns = [],
    setThankYouCampaigns,
    } = useOutletContext();

  const [showCampaignSelector, setShowCampaignSelector] = useState(false);

  const [showCampaignEditor, setShowCampaignEditor] = useState(false);

  const [campaignForm, setCampaignForm] =
    useState(DEFAULT_CAMPAIGN);

  const [editingCampaignId, setEditingCampaignId] =
    useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

  const hasCampaigns = thankYouCampaigns.length > 0;

  const openCampaignSelector = () => {
    setShowCampaignSelector(true);
  };

  const closeCampaignSelector = () => {
    setShowCampaignSelector(false);
  };

  const openNextPurchaseOffer = () => {
    setCampaignForm({
      ...DEFAULT_CAMPAIGN,
      id: "",
    });

    setEditingCampaignId(null);
    setShowCampaignSelector(false);
    setShowCampaignEditor(true);
  };

  const closeCampaignEditor = () => {
    setShowCampaignEditor(false);
    setEditingCampaignId(null);
    setCampaignForm(DEFAULT_CAMPAIGN);
  };

  const updateCampaign = (field, value) => {
    setCampaignForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSaveCampaign = async (event) => {
    event.preventDefault();

    setSaveError("");

    if (!campaignForm.title.trim()) {
        setSaveError("Please enter a campaign name.");
        return;
    }

    if (!campaignForm.heading.trim()) {
        setSaveError("Please enter a customer-facing heading.");
        return;
    }

    try {
        setIsSaving(true);

        const campaign = {
        ...campaignForm,
        id:
            editingCampaignId ||
            `thank-you-${Date.now()}`,
        type: "nextPurchaseOffer",
        };

        const nextCampaigns = editingCampaignId
        ? thankYouCampaigns.map((item) =>
            item.id === editingCampaignId
                ? campaign
                : item,
            )
        : [...thankYouCampaigns, campaign];

        const response = await fetch("/api/thank-you", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            campaigns: nextCampaigns,
        }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.ok) {
        throw new Error(
            result?.error ||
            `Failed to save campaign (${response.status})`,
        );
        }

        setThankYouCampaigns(
        result.campaigns || nextCampaigns,
        );

        setShowCampaignEditor(false);
        setEditingCampaignId(null);
        setCampaignForm(DEFAULT_CAMPAIGN);
    } catch (error) {
        console.error(
        "Failed to save Thank You campaign:",
        error,
        );

        setSaveError(
        error?.message ||
            "Failed to save campaign. Please try again.",
        );
    } finally {
        setIsSaving(false);
    }
    };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              Thank You Page
            </h1>

            <p
              style={{
                color: "#6d7175",
                margin: "8px 0 0",
              }}
            >
              Create campaigns that engage customers after they
              complete a purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={openCampaignSelector}
            style={{
              padding: "11px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#303030",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            + Create Campaign
          </button>
        </div>

        {/* QUICK START CARD */}
        <div
          style={{
            padding: "24px",
            border: "1px solid #e1e3e5",
            borderRadius: "12px",
            background: "#fff",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "#f4f6f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              🎁
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                Increase repeat purchases
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6d7175",
                  fontSize: "14px",
                }}
              >
                Give customers a reason to come back with a
                personalized post-purchase offer.
              </p>
            </div>

            <button
              type="button"
              onClick={openCampaignSelector}
              style={{
                padding: "9px 14px",
                border: "1px solid #c9cccf",
                borderRadius: "8px",
                background: "#fff",
                color: "#303030",
                cursor: "pointer",
                fontWeight: "600",
                whiteSpace: "nowrap",
              }}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* CAMPAIGN TABLE */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e1e3e5",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e1e3e5",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Thank You Campaigns
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6d7175",
                fontSize: "14px",
              }}
            >
              {thankYouCampaigns.length} campaign
              {thankYouCampaigns.length === 1 ? "" : "s"}{" "}
              configured
            </p>
          </div>

          {!hasCampaigns ? (
            <div
              style={{
                padding: "60px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: "#f6f6f7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                }}
              >
                🎯
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "17px",
                  fontWeight: "700",
                }}
              >
                No campaigns yet
              </h3>

              <p
                style={{
                  maxWidth: "460px",
                  margin: "0 auto 20px",
                  color: "#6d7175",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Create your first Thank You campaign to engage
                customers after they complete an order.
              </p>

              <button
                type="button"
                onClick={openCampaignSelector}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#303030",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                + Create Campaign
              </button>
            </div>
          ) : (
            <div>
              {thankYouCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    padding: "18px 24px",
                    borderBottom:
                      "1px solid #e1e3e5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {campaign.title ||
                          "Untitled Campaign"}
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          color: "#6d7175",
                          fontSize: "13px",
                        }}
                      >
                        {campaign.type ||
                          "Campaign"}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "999px",
                        background:
                          campaign.status ===
                          "Active"
                            ? "#e3f1df"
                            : "#f6f6f7",
                        color:
                          campaign.status ===
                          "Active"
                            ? "#18794e"
                            : "#6d7175",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {campaign.status ||
                        "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CAMPAIGN TYPE SELECTOR */}
      {showCampaignSelector && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background:
              "rgba(32, 34, 35, 0.55)",
            overflow: "auto",
          }}
        >
          <button
            type="button"
            aria-label="Close campaign selector"
            onClick={closeCampaignSelector}
            style={{
              position: "absolute",
              inset: 0,
              border: 0,
              background: "none",
            }}
          />

          <section
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "760px",
              background: "#fff",
              borderRadius: "14px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "22px 24px",
                borderBottom:
                  "1px solid #e1e3e5",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Create Thank You Campaign
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#6d7175",
                    fontSize: "13px",
                  }}
                >
                  Choose what you want to show
                  after purchase.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCampaignSelector}
                style={{
                  border: 0,
                  background: "none",
                  fontSize: "24px",
                  lineHeight: 1,
                  cursor: "pointer",
                  color: "#6d7175",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              {CAMPAIGN_TYPES.map(
                (campaign) => (
                  <button
                    key={campaign.type}
                    type="button"
                    onClick={() => {
                      if (
                        campaign.type ===
                        "nextPurchaseOffer"
                      ) {
                        openNextPurchaseOffer();
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems:
                        "flex-start",
                      gap: "14px",
                      padding: "18px",
                      border:
                        "1px solid #d2d5d9",
                      borderRadius: "10px",
                      background: "#fff",
                      cursor:
                        campaign.type ===
                        "nextPurchaseOffer"
                          ? "pointer"
                          : "default",
                      textAlign: "left",
                      opacity:
                        campaign.type ===
                        "nextPurchaseOffer"
                          ? 1
                          : 0.65,
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "9px",
                        background:
                          "#f6f6f7",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize: "21px",
                        flexShrink: 0,
                      }}
                    >
                      {campaign.icon}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#202223",
                        }}
                      >
                        {campaign.title}
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          lineHeight: "1.45",
                          color: "#6d7175",
                        }}
                      >
                        {campaign.description}
                      </div>

                      {campaign.type !==
                        "nextPurchaseOffer" && (
                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#8c9196",
                          }}
                        >
                          Coming soon
                        </div>
                      )}
                    </div>
                  </button>
                ),
              )}
            </div>
          </section>
        </div>
      )}

      {/* NEXT PURCHASE OFFER EDITOR */}
      {showCampaignEditor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background:
              "rgba(32, 34, 35, 0.55)",
            overflow: "auto",
          }}
        >
          <button
            type="button"
            aria-label="Close campaign editor"
            onClick={closeCampaignEditor}
            style={{
              position: "absolute",
              inset: 0,
              border: 0,
              background: "none",
            }}
          />

          <section
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1100px",
              background: "#fff",
              borderRadius: "14px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* EDITOR HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderBottom:
                  "1px solid #e1e3e5",
                flexShrink: 0,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  🎁 Next Purchase Offer
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#6d7175",
                    fontSize: "13px",
                  }}
                >
                  Configure the offer customers
                  see after completing their order.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCampaignEditor}
                style={{
                  border: 0,
                  background: "none",
                  fontSize: "24px",
                  lineHeight: 1,
                  cursor: "pointer",
                  color: "#6d7175",
                }}
              >
                ×
              </button>
            </div>

            {/* EDITOR BODY */}
            <form
              onSubmit={handleSaveCampaign}
              style={{
                overflowY: "auto",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) minmax(340px, 420px)",
                  gap: "28px",
                  alignItems: "start",
                }}
              >
                {/* LEFT SETTINGS */}
                <div
                  style={{
                    display: "grid",
                    gap: "24px",
                  }}
                >
                  {/* Campaign Settings */}
                  <div
                    style={{
                      border:
                        "1px solid #e1e3e5",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <h3
                      style={{
                        margin:
                          "0 0 16px",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Campaign Settings
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          htmlFor="campaign-title"
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "6px",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          Campaign Name
                        </label>

                        <input
                          id="campaign-title"
                          value={
                            campaignForm.title
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "title",
                              event.target
                                .value,
                            )
                          }
                          placeholder="e.g. Summer Thank You Offer"
                          style={inputStyle}
                        />

                        <div
                          style={{
                            marginTop:
                              "5px",
                            color:
                              "#6d7175",
                            fontSize:
                              "12px",
                          }}
                        >
                          Internal name used
                          to identify this
                          campaign.
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="campaign-status"
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "6px",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                          }}
                        >
                          Status
                        </label>

                        <select
                          id="campaign-status"
                          value={
                            campaignForm.status
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "status",
                              event.target
                                .value,
                            )
                          }
                          style={inputStyle}
                        >
                          <option value="Draft">
                            Draft
                          </option>
                          <option value="Active">
                            Active
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER CONTENT */}
                  <div
                    style={{
                      border:
                        "1px solid #e1e3e5",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <h3
                      style={{
                        margin:
                          "0 0 16px",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Customer Content
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          htmlFor="campaign-heading"
                          style={labelStyle}
                        >
                          Heading
                        </label>

                        <input
                          id="campaign-heading"
                          value={
                            campaignForm.heading
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "heading",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Thanks for your order!"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="campaign-description"
                          style={labelStyle}
                        >
                          Description
                        </label>

                        <textarea
                          id="campaign-description"
                          value={
                            campaignForm.description
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "description",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Enjoy 15% OFF your next purchase."
                          rows={4}
                          style={{
                            ...inputStyle,
                            resize:
                              "vertical",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="campaign-offer-text"
                          style={labelStyle}
                        >
                          Offer Text
                        </label>

                        <input
                          id="campaign-offer-text"
                          value={
                            campaignForm.offerText
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "offerText",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Get 15% off your next order"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="campaign-discount"
                          style={labelStyle}
                        >
                          Discount Code
                        </label>

                        <input
                          id="campaign-discount"
                          value={
                            campaignForm.discountCode
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "discountCode",
                              event.target
                                .value,
                            )
                          }
                          placeholder="e.g. THANKYOU15"
                          style={inputStyle}
                        />

                        <div
                          style={{
                            marginTop:
                              "5px",
                            color:
                              "#6d7175",
                            fontSize:
                              "12px",
                          }}
                        >
                          We'll connect this
                          field to your Shopify
                          discount system next.
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "14px",
                        }}
                      >
                        <div>
                          <label
                            htmlFor="campaign-button-text"
                            style={labelStyle}
                          >
                            Button Text
                          </label>

                          <input
                            id="campaign-button-text"
                            value={
                              campaignForm.buttonText
                            }
                            onChange={(event) =>
                              updateCampaign(
                                "buttonText",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Shop Again"
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="campaign-button-url"
                            style={labelStyle}
                          >
                            Button URL
                          </label>

                          <input
                            id="campaign-button-url"
                            value={
                              campaignForm.buttonUrl
                            }
                            onChange={(event) =>
                              updateCampaign(
                                "buttonUrl",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="/collections/all"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DISPLAY RULES */}
                  <div
                    style={{
                      border:
                        "1px solid #e1e3e5",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <h3
                      style={{
                        margin:
                          "0 0 16px",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      Display Rules
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          htmlFor="display-condition"
                          style={labelStyle}
                        >
                          Show Campaign
                        </label>

                        <select
                          id="display-condition"
                          value={
                            campaignForm.displayCondition
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "displayCondition",
                              event.target
                                .value,
                            )
                          }
                          style={inputStyle}
                        >
                          <option value="all">
                            Every order
                          </option>
                          <option value="firstOrder">
                            First order only
                          </option>
                          <option value="returning">
                            Returning customers
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="minimum-order-value"
                          style={labelStyle}
                        >
                          Minimum Order Value
                        </label>

                        <input
                          id="minimum-order-value"
                          type="number"
                          min="0"
                          value={
                            campaignForm.minimumOrderValue
                          }
                          onChange={(event) =>
                            updateCampaign(
                              "minimumOrderValue",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Optional"
                          style={inputStyle}
                        />

                        <div
                          style={{
                            marginTop:
                              "5px",
                            color:
                              "#6d7175",
                            fontSize:
                              "12px",
                          }}
                        >
                          Leave empty to show
                          the campaign for
                          any order value.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PREVIEW */}
                <div
                  style={{
                    position:
                      "sticky",
                    top: 0,
                  }}
                >
                  <div
                    style={{
                      border:
                        "1px solid #e1e3e5",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding:
                          "14px 18px",
                        borderBottom:
                          "1px solid #e1e3e5",
                        background:
                          "#f6f6f7",
                        fontSize:
                          "13px",
                        fontWeight:
                          "700",
                      }}
                    >
                      Live Preview
                    </div>

                    <div
                      style={{
                        padding:
                          "24px",
                        background:
                          "#f6f6f7",
                      }}
                    >
                      {/* Fake Shopify Thank You */}
                      <div
                        style={{
                          background:
                            "#fff",
                          borderRadius:
                            "10px",
                          border:
                            "1px solid #e1e3e5",
                          overflow:
                            "hidden",
                        }}
                      >
                        <div
                          style={{
                            padding:
                              "16px 18px",
                            borderBottom:
                              "1px solid #e1e3e5",
                            fontSize:
                              "12px",
                            color:
                              "#6d7175",
                          }}
                        >
                          ✓ Order confirmed
                        </div>

                        <div
                          style={{
                            padding:
                              "28px 22px",
                            textAlign:
                              "center",
                          }}
                        >
                          <div
                            style={{
                              width:
                                "48px",
                              height:
                                "48px",
                              margin:
                                "0 auto 14px",
                              borderRadius:
                                "50%",
                              background:
                                "#f1f8ff",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              fontSize:
                                "22px",
                            }}
                          >
                            🎁
                          </div>

                          <h3
                            style={{
                              margin:
                                "0 0 8px",
                              fontSize:
                                "20px",
                              lineHeight:
                                "1.25",
                              fontWeight:
                                "700",
                            }}
                          >
                            {campaignForm.heading ||
                              "Thanks for your order!"}
                          </h3>

                          <p
                            style={{
                              margin:
                                "0 auto 16px",
                              maxWidth:
                                "320px",
                              color:
                                "#6d7175",
                              fontSize:
                                "14px",
                              lineHeight:
                                "1.5",
                            }}
                          >
                            {campaignForm.description ||
                              "Enjoy 15% OFF your next purchase."}
                          </p>

                          {campaignForm.offerText && (
                            <div
                              style={{
                                margin:
                                  "0 auto 14px",
                                padding:
                                  "10px 12px",
                                borderRadius:
                                  "8px",
                                background:
                                  "#f6f6f7",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              {
                                campaignForm.offerText
                              }
                            </div>
                          )}

                          {campaignForm.discountCode && (
                            <div
                              style={{
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                gap: "8px",
                                padding:
                                  "8px 12px",
                                border:
                                  "1px dashed #b5b5b5",
                                borderRadius:
                                  "7px",
                                marginBottom:
                                  "16px",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "700",
                              }}
                            >
                              {
                                campaignForm.discountCode
                              }

                              <span
                                style={{
                                  fontSize:
                                    "11px",
                                  color:
                                    "#6d7175",
                                  fontWeight:
                                    "500",
                                }}
                              >
                                Copy
                              </span>
                            </div>
                          )}

                          <div>
                            <button
                              type="button"
                              style={{
                                width:
                                  "100%",
                                padding:
                                  "11px 16px",
                                border:
                                  "none",
                                borderRadius:
                                  "7px",
                                background:
                                  "#303030",
                                color:
                                  "#fff",
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "600",
                              }}
                            >
                              {campaignForm.buttonText ||
                                "Shop Again"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {saveError && (
                <div
                    style={{
                    marginTop: "20px",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: "#fff4f4",
                    border: "1px solid #f0b8b8",
                    color: "#b42318",
                    fontSize: "13px",
                    }}
                >
                    {saveError}
                </div>
              )}
           
              {/* FORM ACTIONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                  marginTop: "24px",
                  paddingTop: "18px",
                  borderTop:
                    "1px solid #e1e3e5",
                }}
              >
                <button
                  type="button"
                  onClick={closeCampaignEditor}
                  style={{
                    padding:
                      "10px 16px",
                    border:
                      "1px solid #c9cccf",
                    borderRadius:
                      "8px",
                    background:
                      "#fff",
                    color:
                      "#303030",
                    cursor:
                      "pointer",
                    fontWeight:
                      "600",
                  }}
                >
                  Cancel
                </button>

                <button
                type="submit"
                disabled={isSaving}
                style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "8px",
                    background: isSaving ? "#8c9196" : "#303030",
                    color: "#fff",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    fontWeight: "600",
                }}
                >
                {isSaving ? "Saving..." : "Save Campaign"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #c9cccf",
  borderRadius: "8px",
  background: "#fff",
  fontSize: "14px",
  color: "#202223",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: "600",
};