import PropTypes from "prop-types";

export default function MessageTable({ messages = [], onEdit, onDelete }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f9fafb",
            }}
          >
            <th style={{ padding: "16px", textAlign: "left" }}>
              Message
            </th>

            <th style={{ padding: "16px", textAlign: "left" }}>
              Type
            </th>

            <th style={{ padding: "16px", textAlign: "left" }}>
              Status
            </th>

            <th style={{ padding: "16px", textAlign: "left" }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td style={{ padding: "16px" }}>
                {message.title}
              </td>

              <td style={{ padding: "16px" }}>
                {message.type}
              </td>

              <td style={{ padding: "16px" }}>
                {message.status}
              </td>

              <td style={{ padding: "16px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => onEdit(message)}
                    style={{
                      padding: "7px 12px",
                      border: "1px solid #c9cccf",
                      borderRadius: "7px",
                      background: "#f6f6f7",
                      color: "#202223",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${message.title}"?`,
                        )
                      ) {
                        onDelete(message.id);
                      }
                    }}
                    style={{
                      padding: "7px 12px",
                      border: "1px solid #fed7d7",
                      borderRadius: "7px",
                      background: "#fff5f5",
                      color: "#b42318",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

MessageTable.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
