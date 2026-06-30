import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function DiscountForm({
  initialDiscount,
  selectedType,
  onSave,
  onClose,
}) {
  const category = initialDiscount?.category ?? selectedType;
  const [title, setTitle] = useState(initialDiscount?.title ?? "");
  const [code, setCode] = useState(initialDiscount?.code ?? "");
  const [method, setMethod] = useState(
    initialDiscount?.method ?? "Discount code",
  );
  const [type, setType] = useState(initialDiscount?.type ?? "Percentage");
  const [value, setValue] = useState(initialDiscount?.value ?? 10);
  const [minimumPurchase, setMinimumPurchase] = useState(
    initialDiscount?.minimumPurchase ?? 0,
  );
  const [status, setStatus] = useState(initialDiscount?.status ?? "Active");

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    marginTop: "6px",
    padding: "11px 12px",
    border: "1px solid #c9cccf",
    borderRadius: "8px",
    background: "#fff",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      id: initialDiscount?.id ?? Date.now(),
      category,
      method,
      title: title.trim(),
      code: method === "Discount code" ? code.trim().toUpperCase() : "",
      type,
      value: Number(value),
      minimumPurchase: Number(minimumPurchase),
      status,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: "20px",
        background: "rgba(32, 34, 35, 0.55)",
      }}
    >
      <button
        type="button"
        aria-label="Close discount form"
        onClick={onClose}
        style={{ position: "absolute", inset: 0, border: 0, background: "none" }}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="discount-form-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          borderRadius: "14px",
          background: "#fff",
          boxShadow: "0 20px 50px rgba(0,0,0,.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 id="discount-form-title" style={{ margin: 0 }}>
              {initialDiscount ? "Edit discount" : category}
            </h2>
            <p style={{ margin: "6px 0 22px", color: "#6d7175" }}>
              Configure the offer customers can use at checkout.
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 0, background: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="discount-method">Method</label>
            <select
              id="discount-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              style={fieldStyle}
            >
              <option>Discount code</option>
              <option>Automatic discount</option>
            </select>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="discount-title">Internal title</label>
            <input id="discount-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Summer promotion" required style={fieldStyle} />
          </div>
          {method === "Discount code" && (
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="discount-code">Discount code</label>
            <input id="discount-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="SUMMER20" required style={{ ...fieldStyle, textTransform: "uppercase" }} />
          </div>
          )}
          {category === "Free shipping" && (
            <div style={{ padding: "12px", marginBottom: "16px", borderRadius: "8px", background: "#f1f8ff", color: "#005bd3" }}>
              Shipping charges are removed when the minimum purchase is met.
            </div>
          )}
          {category !== "Free shipping" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
            <div>
              <label htmlFor="discount-type">Discount type</label>
              <select id="discount-type" value={type} onChange={(event) => setType(event.target.value)} style={fieldStyle}>
                <option>Percentage</option>
                <option>Fixed amount</option>
              </select>
            </div>
            <div>
              <label htmlFor="discount-value">{type === "Percentage" ? "Percentage" : "Amount (₹)"}</label>
              <input id="discount-value" type="number" min="1" max={type === "Percentage" ? 100 : undefined} value={value} onChange={(event) => setValue(event.target.value)} required style={fieldStyle} />
            </div>
          </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label htmlFor="minimum-purchase">Minimum purchase (₹)</label>
              <input id="minimum-purchase" type="number" min="0" value={minimumPurchase} onChange={(event) => setMinimumPurchase(event.target.value)} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="discount-status">Status</label>
              <select id="discount-status" value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
                <option>Active</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 16px", border: "1px solid #c9cccf", borderRadius: "8px", background: "#fff", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: "10px 16px", border: 0, borderRadius: "8px", background: "#303030", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{initialDiscount ? "Update discount" : "Create discount"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

DiscountForm.propTypes = {
  initialDiscount: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    minimumPurchase: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string,
    method: PropTypes.string,
  }),
  selectedType: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
