import PropTypes from "prop-types";
import { useState } from "react";

export default function RuleBuilder({ onRulesChange, initialRules = [] }) {
  const [rules, setRules] = useState(initialRules.length > 0 ? initialRules : [{ id: 1, condition: "minimumPurchase", operator: "greaterThan", value: "" }]);

  const conditions = [
    { value: "minimumPurchase", label: "Minimum Purchase Amount" },
    { value: "productInCart", label: "Specific Product in Cart" },
    { value: "collectionInCart", label: "Collection in Cart" },
    { value: "cartQuantity", label: "Minimum Cart Quantity" },
    { value: "cartTotal", label: "Cart Total" },
  ];

  const operators = {
    minimumPurchase: ["greaterThan", "greaterThanOrEqual", "equals"],
    productInCart: ["includes", "excludes"],
    collectionInCart: ["includes", "excludes"],
    cartQuantity: ["greaterThan", "equals", "lessThan"],
    cartTotal: ["greaterThan", "lessThan", "between"],
  };

  const operatorLabels = {
    greaterThan: "Greater than",
    greaterThanOrEqual: "Greater than or equal",
    lessThan: "Less than",
    equals: "Equals",
    includes: "Includes",
    excludes: "Excludes",
    between: "Between",
  };

  const handleAddRule = () => {
    const newRule = {
      id: Math.max(...rules.map(r => r.id), 0) + 1,
      condition: "minimumPurchase",
      operator: "greaterThan",
      value: "",
    };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const handleUpdateRule = (id, field, value) => {
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const handleRemoveRule = (id) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 12px",
    border: "1px solid #c9cccf",
    borderRadius: "6px",
    background: "#fff",
    fontSize: "14px",
  };

  return (
    <div style={{ padding: "16px", background: "#f6f6f7", borderRadius: "10px" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>Trigger Rules</h3>
      <p style={{ margin: "0 0 16px", color: "#6d7175", fontSize: "13px" }}>
        Define conditions that trigger the upsell offer
      </p>

      <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
        {rules.map((rule) => (
          <div
            key={rule.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr auto",
              gap: "10px",
              alignItems: "end",
              padding: "12px",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #e1e3e5",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#6d7175" }}>Condition</label>
              <select
                value={rule.condition}
                onChange={(e) => handleUpdateRule(rule.id, "condition", e.target.value)}
                style={fieldStyle}
              >
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#6d7175" }}>Operator</label>
              <select
                value={rule.operator}
                onChange={(e) => handleUpdateRule(rule.id, "operator", e.target.value)}
                style={fieldStyle}
              >
                {(operators[rule.condition] || []).map((op) => (
                  <option key={op} value={op}>
                    {operatorLabels[op]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", marginBottom: "4px", color: "#6d7175" }}>Value</label>
              <input
                type={rule.condition === "minimumPurchase" || rule.condition === "cartTotal" ? "number" : "text"}
                value={rule.value}
                onChange={(e) => handleUpdateRule(rule.id, "value", e.target.value)}
                placeholder="Enter value"
                style={fieldStyle}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveRule(rule.id)}
              style={{
                padding: "8px 12px",
                background: "#fff5f5",
                border: "1px solid #fed7d7",
                borderRadius: "6px",
                color: "#b42318",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddRule}
        style={{
          padding: "10px 16px",
          border: "1px solid #c9cccf",
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        + Add Rule
      </button>
    </div>
  );
}

RuleBuilder.propTypes = {
  onRulesChange: PropTypes.func.isRequired,
  initialRules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      condition: PropTypes.string.isRequired,
      operator: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};
