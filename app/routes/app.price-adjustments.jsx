
import { useCallback, useEffect, useState } from "react";
import PriceAdjustmentForm from "../components/PriceAdjustments/PriceAdjustmentForm";
import PriceAdjustmentTable from "../components/PriceAdjustments/PriceAdjustmentTable";

export default function PriceAdjustmentsPage() {
  const [rules, setRules] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [rulesResponse, collectionsResponse] = await Promise.all([
        fetch("/api/price-adjustments"),
        fetch("/api/collections"),
      ]);

      const rulesData = await rulesResponse.json();
      const collectionsData = await collectionsResponse.json();

      if (!rulesResponse.ok || !rulesData.ok) {
        throw new Error(
          rulesData.error || "Failed to load price adjustment rules.",
        );
      }

      if (!collectionsResponse.ok || !collectionsData.ok) {
        throw new Error(
          collectionsData.error || "Failed to load collections.",
        );
      }

      const availableCollections = collectionsData.collections || [];
      setCollections(availableCollections);

      setRules(
        (rulesData.rules || []).map((rule) => ({
          ...rule,
          collections: availableCollections.filter((collection) =>
            (rule.collectionIds || []).includes(collection.id),
          ),
        })),
      );
    } catch (err) {
      setError(err.message || "Failed to load price adjustments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function persistRules(nextRules) {
    const response = await fetch("/api/price-adjustments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules: nextRules }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Failed to save price adjustment rules.");
    }

    setRules(
      (data.rules || []).map((rule) => ({
        ...rule,
        collections: collections.filter((collection) =>
          (rule.collectionIds || []).includes(collection.id),
        ),
      })),
    );
  }

  async function handleSave(formData) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const nextRules = editingRule
        ? rules.map((rule) =>
            rule.id === editingRule.id
              ? { ...rule, ...formData, id: editingRule.id }
              : rule,
          )
        : [...rules, formData];

      await persistRules(nextRules);
      setShowForm(false);
      setEditingRule(null);
      setSuccess("Price adjustment rule saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save the rule.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(rule) {
    if (!window.confirm(`Delete "${rule.title}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await persistRules(rules.filter((item) => item.id !== rule.id));
      setSuccess("Price adjustment rule deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete the rule.");
    }
  }

  async function handleToggle(rule) {
    setError("");
    setSuccess("");

    try {
      const nextRules = rules.map((item) =>
        item.id === rule.id
          ? {
              ...item,
              status: item.status === "Active" ? "Draft" : "Active",
            }
          : item,
      );

      await persistRules(nextRules);
      setSuccess("Price adjustment status updated.");
    } catch (err) {
      setError(err.message || "Failed to update the rule.");
    }
  }

  return (
    <s-page heading="Price Adjustments">
      <s-section>
        <s-paragraph>
          Configure percentage price increases for products matched by
          collection or product tag, with a message shown in checkout.
        </s-paragraph>

        <s-button
          variant="primary"
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
        >
          Create price adjustment
        </s-button>
      </s-section>

      {error && (
        <s-section>
          <s-banner tone="critical">{error}</s-banner>
        </s-section>
      )}

      {success && (
        <s-section>
          <s-banner tone="success">{success}</s-banner>
        </s-section>
      )}

      {showForm && (
        <s-section heading={editingRule ? "Edit rule" : "Create rule"}>
          <PriceAdjustmentForm
            key={editingRule?.id || "new-price-adjustment"}
            initialRule={editingRule}
            collections={collections}
            saving={saving}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingRule(null);
              setError("");
            }}
          />
        </s-section>
      )}

      <s-section heading="Your rules">
        {loading ? (
          <s-paragraph>Loading price adjustment rules...</s-paragraph>
        ) : rules.length === 0 ? (
          <s-box padding="base">
            <s-text>No price adjustment rules yet.</s-text>
            <s-paragraph>
              Create your first rule to get started.
            </s-paragraph>
          </s-box>
        ) : (
          <PriceAdjustmentTable
            rules={rules}
            onEdit={(rule) => {
              setEditingRule(rule);
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}
      </s-section>
    </s-page>
  );
}
