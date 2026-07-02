import PropTypes from "prop-types";

export default function DiscountCard({ discount, onEdit, onDelete }) {
  let offer;
  
  if (discount.category === "Buy X get Y") {
    offer = `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
  } else if (discount.category === "Free shipping") {
    offer = "Free shipping";
  } else {
    offer = discount.type === "Percentage"
      ? `${discount.value}% off`
      : `₹${discount.value.toLocaleString("en-IN")} off`;
  }

  return (
    <article style={{ padding: "20px", border: "1px solid #e1e3e5", borderRadius: "12px", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: "17px" }}>{discount.title}</h3>
            <span style={{ padding: "3px 8px", borderRadius: "999px", background: discount.status === "Active" ? "#d4f7dc" : "#e4e5e7", color: "#303030", fontSize: "12px", fontWeight: 600 }}>{discount.status}</span>
            {discount.source === "native" && (
              <span style={{ padding: "3px 8px", borderRadius: "999px", background: "#fff9e6", color: "#8b5900", fontSize: "12px", fontWeight: 600 }}>Shopify Native</span>
            )}
          </div>
          <p style={{ margin: "10px 0 6px", fontSize: "20px", fontWeight: 700 }}>{offer}</p>
          <code style={{ padding: "4px 8px", border: "1px dashed #8c9196", borderRadius: "5px", background: "#f6f6f7" }}>{discount.method === "Automatic discount" ? "AUTOMATIC" : discount.code}</code>
          
          {discount.category === "Buy X get Y" && (
            <div style={{ margin: "12px 0", fontSize: "13px", color: "#6d7175" }}>
              <p style={{ margin: "4px 0" }}>💰 Reward: {discount.rewardType === "Free" ? "Free" : discount.rewardType === "Percentage" ? `${discount.rewardValue}% off` : `₹${discount.rewardValue} off`}</p>
              <p style={{ margin: "4px 0" }}>📦 Item types: {discount.buyItemType} → {discount.getItemType}</p>
            </div>
          )}
          
          <p style={{ margin: "12px 0 0", color: "#6d7175", fontSize: "13px" }}>
            {discount.minimumPurchase > 0 ? `Minimum purchase ₹${discount.minimumPurchase.toLocaleString("en-IN")}` : "No minimum purchase"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <button type="button" onClick={() => onEdit(discount)} style={buttonStyle}>Edit</button>
          <button type="button" onClick={() => window.confirm(`Delete “${discount.title}”?`) && onDelete(discount.id)} style={{ ...buttonStyle, background: "#fff5f5", borderColor: "#fed7d7", color: "#b42318" }}>Delete</button>
        </div>
      </div>
    </article>
  );
}

const buttonStyle = { padding: "7px 12px", border: "1px solid #c9cccf", borderRadius: "7px", background: "#f6f6f7", fontWeight: 600, cursor: "pointer" };

DiscountCard.propTypes = {
  discount: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.number,
    minimumPurchase: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string,
    method: PropTypes.string,
    source: PropTypes.string,
    // Buy X Get Y fields
    buyQuantity: PropTypes.number,
    getQuantity: PropTypes.number,
    buyItemType: PropTypes.string,
    getItemType: PropTypes.string,
    rewardType: PropTypes.string,
    rewardValue: PropTypes.number,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
