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

export default function ThankYou() {
  const { thankYouCampaigns = [] } = useOutletContext();

  const [showCampaignSelector, setShowCampaignSelector] = useState(false);

  const hasCampaigns = thankYouCampaigns.length > 0;

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
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
              Create campaigns that engage customers after they complete a
              purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCampaignSelector(true)}
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

        {/* Quick Campaign Card */}
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
                Give customers a reason to come back with a personalized
                post-purchase offer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCampaignSelector(true)}
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

        {/* Campaigns */}
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
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
                  {thankYouCampaigns.length === 1 ? "" : "s"} configured
                </p>
              </div>
            </div>
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
                Create your first Thank You campaign to engage customers
                after they complete an order.
              </p>

              <button
                type="button"
                onClick={() => setShowCampaignSelector(true)}
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
                    borderBottom: "1px solid #e1e3e5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
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
                        {campaign.title || "Untitled Campaign"}
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          color: "#6d7175",
                          fontSize: "13px",
                        }}
                      >
                        {campaign.type || "Campaign"}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "999px",
                        background:
                          campaign.status === "Active"
                            ? "#e3f1df"
                            : "#f6f6f7",
                        color:
                          campaign.status === "Active"
                            ? "#18794e"
                            : "#6d7175",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {campaign.status || "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Type Selector */}
      {showCampaignSelector && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background: "rgba(32, 34, 35, 0.55)",
            overflow: "auto",
          }}
        >
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close campaign selector"
            onClick={() => setShowCampaignSelector(false)}
            style={{
              position: "absolute",
              inset: 0,
              border: 0,
              background: "none",
              cursor: "default",
            }}
          />

          {/* Modal */}
          <section
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "760px",
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 20px 50px rgba(0,0,0,.2)",
              overflow: "hidden",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "22px 24px",
                borderBottom: "1px solid #e1e3e5",
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
                  Choose what you want to show after purchase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCampaignSelector(false)}
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

            {/* Campaign Types */}
            <div
              style={{
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              {CAMPAIGN_TYPES.map((campaign) => (
                <button
                  key={campaign.type}
                  type="button"
                  onClick={() => {
                    if (campaign.type === "nextPurchaseOffer") {
                      setShowCampaignSelector(false);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "18px",
                    border: "1px solid #d2d5d9",
                    borderRadius: "10px",
                    background: "#fff",
                    cursor:
                      campaign.type === "nextPurchaseOffer"
                        ? "pointer"
                        : "default",
                    textAlign: "left",
                    opacity:
                      campaign.type === "nextPurchaseOffer"
                        ? 1
                        : 0.65,
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "9px",
                      background: "#f6f6f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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

                    {campaign.type !== "nextPurchaseOffer" && (
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
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}