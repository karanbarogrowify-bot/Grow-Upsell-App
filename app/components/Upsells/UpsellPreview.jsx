import PropTypes from "prop-types";
import { useState } from "react";

export default function UpsellPreview({ layout = "grid", title = "Recommended Products", description = "We think you'll love these" }) {
  const [selectedLayout, setSelectedLayout] = useState(layout);

  const mockProducts = [
    { id: "1", title: "Product A", price: "$99", image: "🖼️" },
    { id: "2", title: "Product B", price: "$149", image: "🖼️" },
    { id: "3", title: "Product C", price: "$199", image: "🖼️" },
  ];

  const layouts = [
    { value: "grid", label: "Grid", icon: "⊞" },
    { value: "stack", label: "Stack", icon: "≡" },
    { value: "slider", label: "Slider", icon: "▶" },
  ];

  const renderGridLayout = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
      {mockProducts.map((product) => (
        <div key={product.id} style={{ padding: "12px", border: "1px solid #e1e3e5", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>{product.image}</div>
          <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 600 }}>{product.title}</p>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#005bd3" }}>{product.price}</p>
        </div>
      ))}
    </div>
  );

  const renderStackLayout = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {mockProducts.map((product) => (
        <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #e1e3e5", borderRadius: "8px" }}>
          <div style={{ fontSize: "32px" }}>{product.image}</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>{product.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6d7175" }}>Premium quality item</p>
          </div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#005bd3" }}>{product.price}</p>
        </div>
      ))}
    </div>
  );

  const renderSliderLayout = () => (
    <div style={{ overflow: "hidden", borderRadius: "8px" }}>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "12px", background: "#f6f6f7" }}>
        {mockProducts.map((product) => (
          <div
            key={product.id}
            style={{
              flex: "0 0 200px",
              padding: "12px",
              border: "1px solid #e1e3e5",
              borderRadius: "8px",
              background: "#fff",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>{product.image}</div>
            <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 600 }}>{product.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: 700, color: "#005bd3" }}>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "10px", border: "1px solid #e1e3e5" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: 0, color: "#6d7175", fontSize: "13px" }}>{description}</p>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
        {layouts.map((layoutOption) => (
          <button
            key={layoutOption.value}
            type="button"
            onClick={() => setSelectedLayout(layoutOption.value)}
            style={{
              padding: "10px 16px",
              border: selectedLayout === layoutOption.value ? "2px solid #005bd3" : "1px solid #c9cccf",
              borderRadius: "8px",
              background: selectedLayout === layoutOption.value ? "#f1f8ff" : "#fff",
              color: selectedLayout === layoutOption.value ? "#005bd3" : "#202223",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{layoutOption.icon}</span>
            {layoutOption.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: "200px" }}>
        {selectedLayout === "grid" && renderGridLayout()}
        {selectedLayout === "stack" && renderStackLayout()}
        {selectedLayout === "slider" && renderSliderLayout()}
      </div>

      <div style={{ marginTop: "16px", padding: "12px", background: "#f1f8ff", borderRadius: "8px", fontSize: "12px", color: "#005bd3" }}>
        Layout: <strong>{selectedLayout.charAt(0).toUpperCase() + selectedLayout.slice(1)}</strong>
      </div>
    </div>
  );
}

UpsellPreview.propTypes = {
  layout: PropTypes.oneOf(["grid", "stack", "slider"]),
  title: PropTypes.string,
  description: PropTypes.string,
};
