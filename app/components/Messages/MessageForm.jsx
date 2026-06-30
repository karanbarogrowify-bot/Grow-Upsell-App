import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function MessageForm({
  onSave,
  onClose,
  initialMessage,
}) {
  const [title, setTitle] = useState(initialMessage?.title ?? "");
  const [type, setType] = useState(initialMessage?.type ?? "Shipping");
  const [message, setMessage] = useState(initialMessage?.message ?? "");
  const [status, setStatus] = useState(initialMessage?.status ?? "Active");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedMessage = {
      id: initialMessage?.id ?? Date.now(),
      title,
      type,
      message,
      status,
    };

    onSave(savedMessage);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <button
        type="button"
        aria-label="Close message form"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "default",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-form-title"
        style={{
          width: "700px",
          maxWidth: "90%",
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            id="message-form-title"
            style={{
              margin: 0,
              fontSize: "24px",
            }}
          >
            {initialMessage ? "Edit Checkout Message" : "Create Checkout Message"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="message-title">Title</label>

            <input
              id="message-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Free Shipping Above ₹5000"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="message-type">Message Type</label>

            <select
              id="message-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            >
              <option>Shipping</option>
              <option>Discount</option>
              <option>Info</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="message-body">Message</label>

            <textarea
              id="message-body"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="🚚 Free shipping on orders above ₹5000"
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="message-status">Status</label>

            <select
              id="message-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "6px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            >
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 18px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "12px 18px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {initialMessage ? "Update Message" : "Save Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

MessageForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initialMessage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    message: PropTypes.string,
    status: PropTypes.string.isRequired,
  }),
};
