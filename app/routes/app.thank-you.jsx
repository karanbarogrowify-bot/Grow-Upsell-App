import { useOutletContext } from "react-router";

export default function ThankYou() {
  const {
    thankYouCampaigns,
    shop,
  } = useOutletContext();

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
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
            marginTop: "8px",
          }}
        >
          Create and manage post-purchase campaigns.
        </p>

        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            border: "1px solid #e1e3e5",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "18px",
            }}
          >
            Thank You campaigns
          </h2>

          <p
            style={{
              margin: 0,
              color: "#6d7175",
            }}
          >
            {thankYouCampaigns?.length || 0} campaign(s) configured.
          </p>

          <p
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#6d7175",
            }}
          >
            Store: {shop}
          </p>
        </div>
      </div>
    </div>
  );
}