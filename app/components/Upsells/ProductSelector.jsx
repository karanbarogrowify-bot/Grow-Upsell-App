import PropTypes from "prop-types";
import { useState } from "react";

export default function ProductSelector({ onProductsSelect, initialProducts = [] }) {
  const [selectedProducts, setSelectedProducts] = useState(initialProducts);
  const [mockProducts] = useState([
    { id: "gid://shopify/Product/1", title: "Product A", handle: "product-a" },
    { id: "gid://shopify/Product/2", title: "Product B", handle: "product-b" },
    { id: "gid://shopify/Product/3", title: "Product C", handle: "product-c" },
    { id: "gid://shopify/Product/4", title: "Product D", handle: "product-d" },
    { id: "gid://shopify/Product/5", title: "Product E", handle: "product-e" },
  ]);

  const handleToggleProduct = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    const updated = isSelected
      ? selectedProducts.filter(p => p.id !== product.id)
      : [...selectedProducts, product];
    setSelectedProducts(updated);
    onProductsSelect(updated);
  };

  return (
    <div style={{ padding: "16px", background: "#f6f6f7", borderRadius: "10px" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>
        Select Products ({selectedProducts.length})
      </h3>
      <p style={{ margin: "0 0 16px", color: "#6d7175", fontSize: "13px" }}>
        Choose products that trigger this upsell
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
        {mockProducts.map((product) => {
          const isSelected = selectedProducts.some(p => p.id === product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleToggleProduct(product)}
              style={{
                padding: "12px",
                border: isSelected ? "2px solid #005bd3" : "1px solid #c9cccf",
                borderRadius: "8px",
                background: isSelected ? "#f1f8ff" : "#fff",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                {isSelected && "✓ "}{product.title}
              </div>
              <div style={{ fontSize: "12px", color: "#6d7175" }}>{product.handle}</div>
            </button>
          );
        })}
      </div>

      {selectedProducts.length > 0 && (
        <div style={{ marginTop: "16px", padding: "12px", background: "#fff", borderRadius: "8px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#6d7175" }}>
            Selected: {selectedProducts.map(p => p.title).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

ProductSelector.propTypes = {
  onProductsSelect: PropTypes.func.isRequired,
  initialProducts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      handle: PropTypes.string,
    })
  ),
};
