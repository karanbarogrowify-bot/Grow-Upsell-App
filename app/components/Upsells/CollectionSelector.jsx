import PropTypes from "prop-types";
import { useState } from "react";

export default function CollectionSelector({ onCollectionsSelect, initialCollections = [] }) {
  const [selectedCollections, setSelectedCollections] = useState(initialCollections);
  const [mockCollections] = useState([
    { id: "gid://shopify/Collection/1", title: "Summer Collection", handle: "summer", productCount: 24 },
    { id: "gid://shopify/Collection/2", title: "Winter Essentials", handle: "winter", productCount: 18 },
    { id: "gid://shopify/Collection/3", title: "Best Sellers", handle: "bestsellers", productCount: 42 },
    { id: "gid://shopify/Collection/4", title: "New Arrivals", handle: "new-arrivals", productCount: 15 },
    { id: "gid://shopify/Collection/5", title: "Sale Items", handle: "sale", productCount: 56 },
  ]);

  const handleToggleCollection = (collection) => {
    const isSelected = selectedCollections.some(c => c.id === collection.id);
    const updated = isSelected
      ? selectedCollections.filter(c => c.id !== collection.id)
      : [...selectedCollections, collection];
    setSelectedCollections(updated);
    onCollectionsSelect(updated);
  };

  const getTotalProducts = () => {
    return selectedCollections.reduce((sum, c) => sum + (c.productCount || 0), 0);
  };

  return (
    <div style={{ padding: "16px", background: "#f6f6f7", borderRadius: "10px" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>
        Select Collections ({selectedCollections.length})
      </h3>
      <p style={{ margin: "0 0 16px", color: "#6d7175", fontSize: "13px" }}>
        Choose collections to upsell from (showing product count)
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
        {mockCollections.map((collection) => {
          const isSelected = selectedCollections.some(c => c.id === collection.id);
          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => handleToggleCollection(collection)}
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
                {isSelected && "✓ "}{collection.title}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#6d7175" }}>{collection.handle}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, background: "#e4e5e7", padding: "2px 6px", borderRadius: "4px" }}>
                  {collection.productCount} items
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedCollections.length > 0 && (
        <div style={{ marginTop: "16px", padding: "12px", background: "#fff", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#6d7175" }}>
              Selected: {selectedCollections.map(c => c.title).join(", ")}
            </p>
            <span style={{ fontSize: "12px", fontWeight: 600, background: "#d4f7dc", padding: "4px 8px", borderRadius: "4px", color: "#216534" }}>
              📦 Total {getTotalProducts()} products
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

CollectionSelector.propTypes = {
  onCollectionsSelect: PropTypes.func.isRequired,
  initialCollections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      handle: PropTypes.string,
      productCount: PropTypes.number,
    })
  ),
};
