import PropTypes from "prop-types";
import UpsellCard from "./UpsellCard";

export default function UpsellTable({ upsells = [], onEdit, onDelete, onToggle }) {
  if (upsells.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", background: "#f6f6f7", borderRadius: "10px" }}>
        <p style={{ fontSize: "28px", margin: "0 0 10px" }}>📋</p>
        <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>No upsells yet</h3>
        <p style={{ margin: 0, color: "#6d7175" }}>Create your first upsell offer to get started</p>
      </div>
    );
  }

  const activeCount = upsells.filter(u => u.status === "Active").length;
  const draftCount = upsells.filter(u => u.status === "Draft").length;

  return (
    <div>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", padding: "16px", background: "#f6f6f7", borderRadius: "10px" }}>
        <div>
          <p style={{ margin: 0, fontSize: "12px", color: "#6d7175" }}>Total Upsells</p>
          <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>{upsells.length}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "12px", color: "#6d7175" }}>Active</p>
          <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#216534" }}>✓ {activeCount}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "12px", color: "#6d7175" }}>Draft</p>
          <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700, color: "#8b5900" }}>{draftCount}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {upsells.map((upsell) => (
          <UpsellCard
            key={upsell.id}
            upsell={upsell}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

UpsellTable.propTypes = {
  upsells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
};
