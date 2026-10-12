const cellStyle = {
  padding: "14px 16px",
  textAlign: "left",
  borderBottom: "1px solid #e1e3e5",
  verticalAlign: "middle",
};

const buttonStyle = {
  padding: "7px 10px",
  border: "1px solid #c9cccf",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
};

export default function PriceAdjustmentTable({
  rules = [],
  onEdit,
  onDelete,
  onToggle,
}) {
  if (rules.length === 0) {
    return (
      <div
        style={{
          padding: "44px 24px",
          textAlign: "center",
          background: "#fff",
          border: "1px solid #e1e3e5",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ margin: "0 0 8px" }}>No price adjustment rules yet</h3>
        <p style={{ margin: 0, color: "#6d7175", fontSize: "14px" }}>
          Create a rule to increase prices for products in a collection or with
          a specific tag.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
        background: "#fff",
        border: "1px solid #e1e3e5",
        borderRadius: "12px",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
          minWidth: "760px",
        }}
      >
        <thead>
          <tr style={{ background: "#f6f6f7" }}>
            {["Rule", "Target", "Increase", "Status", "Message", "Actions"].map(
              (heading) => (
                <th key={heading} style={cellStyle}>
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {rules.map((rule) => {
            const target =
              rule.targetType === "tag"
                ? `Tag: ${rule.productTag || "—"}`
                : `Collection${rule.collectionIds?.length === 1 ? "" : "s"}: ${
                    rule.collections?.map((item) => item.title).join(", ") ||
                    `${rule.collectionIds?.length || 0} selected`
                  }`;

            return (
              <tr key={rule.id}>
                <td style={cellStyle}>
                  <strong>{rule.title}</strong>
                </td>

                <td style={cellStyle}>{target}</td>

                <td style={cellStyle}>
                  <strong>{Number(rule.percentage) || 0}%</strong>
                </td>

                <td style={cellStyle}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 9px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: rule.status === "Active" ? "#176c3a" : "#6d7175",
                      background:
                        rule.status === "Active" ? "#e3f5e9" : "#f1f2f3",
                    }}
                  >
                    {rule.status || "Draft"}
                  </span>
                </td>

                <td
                  style={{
                    ...cellStyle,
                    maxWidth: "220px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {rule.message}
                </td>

                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      style={buttonStyle}
                      onClick={() => onEdit?.(rule)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      style={buttonStyle}
                      onClick={() => onToggle?.(rule)}
                    >
                      {rule.status === "Active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      style={{
                        ...buttonStyle,
                        color: "#b42318",
                      }}
                      onClick={() => onDelete?.(rule)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
