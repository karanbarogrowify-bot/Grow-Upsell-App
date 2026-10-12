import { useEffect, useState } from "react";

const INITIAL_FORM = {
  title: "",
  status: "Draft",
  targetType: "collection",
  collectionIds: [],
  collections: [],
  productTag: "",
  percentage: "10",
  message: "A special price adjustment applies to this product.",
};

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  marginTop: "6px",
  padding: "11px 12px",
  border: "1px solid #c9cccf",
  borderRadius: "8px",
  background: "#fff",
};

export default function PriceAdjustmentForm({
  initialRule,
  collections = [],
  saving = false,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialRule) {
      setForm(INITIAL_FORM);
      setError("");
      return;
    }

    setForm({
      ...INITIAL_FORM,
      ...initialRule,
      percentage: String(initialRule.percentage ?? 10),
      collectionIds: initialRule.collectionIds || [],
      collections: initialRule.collections || [],
    });
    setError("");
  }, [initialRule]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleCollection = (collection) => {
    setForm((current) => {
      const selected = current.collectionIds.includes(collection.id);
      const collectionIds = selected
        ? current.collectionIds.filter((id) => id !== collection.id)
        : [...current.collectionIds, collection.id];

      const selectedCollections = selected
        ? current.collections.filter((item) => item.id !== collection.id)
        : [
            ...current.collections.filter((item) => item.id !== collection.id),
            collection,
          ];

      return {
        ...current,
        collectionIds,
        collections: selectedCollections,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const percentage = Number(form.percentage);

    if (!form.title.trim()) {
      setError("Enter a rule name.");
      return;
    }

    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      setError("Enter a percentage greater than 0 and no more than 100.");
      return;
    }

    if (
      form.targetType === "collection" &&
      form.collectionIds.length === 0
    ) {
      setError("Select at least one collection.");
      return;
    }

    if (form.targetType === "tag" && !form.productTag.trim()) {
      setError("Enter a product tag.");
      return;
    }

    if (!form.message.trim()) {
      setError("Enter the checkout message.");
      return;
    }

    onSave({
      ...form,
      id: initialRule?.id || `price-adjustment-${Date.now()}`,
      title: form.title.trim(),
      percentage,
      productTag: form.productTag.trim(),
      message: form.message.trim(),
      collectionIds: form.collectionIds,
      collections: form.collections,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: "22px", padding: "24px" }}
    >
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: "21px" }}>
          {initialRule ? "Edit Price Adjustment" : "Create Price Adjustment"}
        </h2>
        <p style={{ margin: 0, color: "#6d7175", fontSize: "13px" }}>
          Increase the price of matching products at checkout.
        </p>
      </div>

      <div>
        <label htmlFor="price-adjustment-title">
          Rule name
        </label>
        <input
          id="price-adjustment-title"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="e.g. Premium Collection Increase"
          required
          style={fieldStyle}
        />
      </div>

      <div>
        <label htmlFor="price-adjustment-status">Status</label>
        <select
          id="price-adjustment-status"
          value={form.status}
          onChange={(event) => update("status", event.target.value)}
          style={fieldStyle}
        >
          <option value="Draft">Draft</option>
          <option value="Active">Active</option>
        </select>
      </div>

      <div>
        <h3 style={{ margin: "0 0 12px" }}>Apply to products by</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { value: "collection", label: "Collection" },
            { value: "tag", label: "Product tag" },
          ].map((option) => (
            <label
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                border: form.targetType === option.value
                  ? "2px solid #005bd3"
                  : "1px solid #c9cccf",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="price-adjustment-target"
                value={option.value}
                checked={form.targetType === option.value}
                onChange={() => update("targetType", option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {form.targetType === "collection" ? (
        <div>
          <label>Choose collections</label>
          {collections.length === 0 ? (
            <p style={{ color: "#6d7175", fontSize: "13px" }}>
              No collections loaded yet. We'll connect the collection loader
              when we build the dashboard route.
            </p>
          ) : (
            <div
              style={{
                marginTop: "8px",
                border: "1px solid #c9cccf",
                borderRadius: "8px",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {collections.map((collection) => (
                <label
                  key={collection.id}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.collectionIds.includes(collection.id)}
                    onChange={() => toggleCollection(collection)}
                  />
                  <span>{collection.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <label htmlFor="price-adjustment-tag">Product tag</label>
          <input
            id="price-adjustment-tag"
            value={form.productTag}
            onChange={(event) => update("productTag", event.target.value)}
            placeholder="e.g. premium"
            style={fieldStyle}
          />
          <p style={{ color: "#6d7175", fontSize: "12px" }}>
            Enter the exact tag used on the Shopify product.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="price-adjustment-percentage">
          Price increase percentage
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            id="price-adjustment-percentage"
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={form.percentage}
            onChange={(event) => update("percentage", event.target.value)}
            required
            style={fieldStyle}
          />
          <strong>%</strong>
        </div>
        <p style={{ color: "#6d7175", fontSize: "12px" }}>
          Example: a 10% increase on ₹1,000 results in ₹1,100 before any
          applicable taxes or other adjustments.
        </p>
      </div>

      <div>
        <label htmlFor="price-adjustment-message">
          Message below the product in checkout
        </label>
        <textarea
          id="price-adjustment-message"
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="Explain the price adjustment to the customer"
          rows={3}
          required
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "12px",
            color: "#b42318",
            background: "#fef3f2",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          borderTop: "1px solid #e1e3e5",
          paddingTop: "16px",
        }}
      >
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : initialRule ? "Update Rule" : "Create Rule"}
        </button>
      </div>
    </form>
  );
}
