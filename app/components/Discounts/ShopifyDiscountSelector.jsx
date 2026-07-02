import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function ShopifyDiscountSelector({ onSelect, onClose, shopifyDiscounts = [] }) {
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState(shopifyDiscounts);

  useEffect(() => {
    setDiscounts(shopifyDiscounts);
  }, [shopifyDiscounts]);

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
        aria-label="Close discount selector"
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
        aria-labelledby="shopify-discount-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "70vh",
          borderRadius: "14px",
          background: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            borderBottom: "1px solid #e1e3e5",
          }}
        >
          <h2 id="shopify-discount-title" style={{ margin: 0, fontSize: "20px" }}>
            Select Shopify Discount
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 0, background: "none", fontSize: "24px", cursor: "pointer" }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
              }}
            >
              <p style={{ color: "#6d7175" }}>Loading discounts...</p>
            </div>
          ) : discounts.length > 0 ? (
            <div style={{ display: "grid", gap: "8px" }}>
              {discounts.map((discount) => (
                <button
                  key={discount.id}
                  type="button"
                  onClick={() => onSelect(discount)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e1e3e5",
                    borderRadius: "8px",
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
                  <strong style={{ marginBottom: "4px" }}>
                    {discount.code || discount.title}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#6d7175" }}>
                    {discount.type || "Price Rule"}
                    {discount.value && ` • ${discount.value}`}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "#6d7175",
              }}
            >
              <p>No Shopify discounts found</p>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "16px",
            borderTop: "1px solid #e1e3e5",
            background: "#fafbfc",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 16px",
              border: "1px solid #c9cccf",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}

ShopifyDiscountSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  shopifyDiscounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      code: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};
