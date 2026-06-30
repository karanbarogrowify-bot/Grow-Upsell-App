export default function MessageFilters() {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      <input
        placeholder="Search messages..."
        style={{
          flex: 1,
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />

      <select
        style={{
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <option>All Types</option>
        <option>Shipping</option>
        <option>Discount</option>
      </select>

      <select
        style={{
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <option>All Status</option>
        <option>Active</option>
        <option>Draft</option>
      </select>
    </div>
  );
}