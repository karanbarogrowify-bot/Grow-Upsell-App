import PropTypes from "prop-types";

const sources = [
  {
    type: "native",
    title: "Shopify Native Discount",
    description: "Link to existing Shopify discount codes or price rules",
    icon: "🛍️",
  },
  {
    type: "custom",
    title: "Custom Discount",
    description: "Create a new discount within this app",
    icon: "⚙️",
  },
];

export default function DiscountSourceModal({ onSelect, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "20px",
        background: "rgba(32,34,35,.55)",
      }}
    >
      <button
        type="button"
        aria-label="Close discount source picker"
        onClick={onClose}
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
        aria-labelledby="discount-source-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "540px",
          borderRadius: "14px",
          background: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,.2)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <h2 id="discount-source-title" style={{ margin: 0, fontSize: "20px" }}>
            Choose discount source
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 0, background: "none", fontSize: "24px", cursor: "pointer" }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "grid", gap: "12px", padding: "0 20px 20px" }}>
          {sources.map((source) => (
            <button
              key={source.type}
              type="button"
              onClick={() => onSelect(source.type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                border: "2px solid #e1e3e5",
                borderRadius: "10px",
                background: "#fff",
                color: "#202223",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#303030";
                e.currentTarget.style.background = "#f6f6f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e1e3e5";
                e.currentTarget.style.background = "#fff";
              }}
            >
              <span style={{ fontSize: "28px" }}>{source.icon}</span>
              <div>
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  {source.title}
                </strong>
                <span style={{ color: "#6d7175", fontSize: "14px" }}>
                  {source.description}
                </span>
              </div>
              <span aria-hidden="true" style={{ marginLeft: "auto" }}>
                ›
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

DiscountSourceModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
