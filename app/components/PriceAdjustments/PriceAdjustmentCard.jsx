export default function PriceAdjustmentCard({
  rule,
  onEdit,
  onDelete,
  onToggle,
}) {
  const isActive = rule.status === "Active";

  const targetLabel =
    rule.targetType === "tag"
      ? `Product tag: ${rule.productTag || "Not set"}`
      : `Collections: ${
          rule.collections?.map((item) => item.title).join(", ") ||
          `${rule.collectionIds?.length || 0} selected`
        }`;

  return (
    <article
      style={{
        padding: "20px",
        background: "#fff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
        display: "grid",
        gap: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "17px" }}>{rule.title}</h3>
          <p style={{ margin: "6px 0 0", color: "#6d7175", fontSize: "13px" }}>
            {targetLabel}
          </p>
        </div>

        <span
          style={{
            padding: "5px 9px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: isActive ? "#176c3a" : "#6d7175",
            background: isActive ? "#e3f5e9" : "#f1f2f3",
          }}
        >
          {rule.status || "Draft"}
        </span>
      </div>

      <div
        style={{
          padding: "14px",
          borderRadius: "8px",
          background: "#f6f6f7",
        }}
      >
        <p style={{ margin: 0, color: "#6d7175", fontSize: "12px" }}>
          Price increase
        </p>
        <strong style={{ fontSize: "25px" }}>
          {Number(rule.percentage) || 0}%
        </strong>
      </div>

      <div>
        <p style={{ margin: "0 0 5px", fontSize: "12px", color: "#6d7175" }}>
          Checkout message
        </p>
        <p style={{ margin: 0, fontSize: "13px", overflowWrap: "anywhere" }}>
          {rule.message}
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" onClick={() => onEdit?.(rule)}>
          Edit
        </button>
        <button type="button" onClick={() => onToggle?.(rule)}>
          {isActive ? "Deactivate" : "Activate"}
        </button>
        <button type="button" onClick={() => onDelete?.(rule)}>
          Delete
        </button>
      </div>
    </article>
  );
}
