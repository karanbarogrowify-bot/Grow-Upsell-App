import { useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import DiscountCard from "../components/Discounts/DiscountCard";
import DiscountForm from "../components/Discounts/DiscountForm";
import DiscountTypeModal from "../components/Discounts/DiscountTypeModal";

export default function Discounts() {
  const { discounts, setDiscounts } = useOutletContext();
  const [formOpen, setFormOpen] = useState(false);
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const visibleDiscounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return discounts.filter(
      (discount) =>
        (status === "All" || discount.status === status) &&
        (!query ||
          discount.title.toLowerCase().includes(query) ||
          discount.code.toLowerCase().includes(query)),
    );
  }, [discounts, search, status]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingDiscount(null);
    setSelectedType(null);
  };

  const saveDiscount = (savedDiscount) => {
    setDiscounts((current) =>
      editingDiscount
        ? current.map((discount) =>
            discount.id === savedDiscount.id ? savedDiscount : discount,
          )
        : [...current, savedDiscount],
    );
  };

  return (
    <main style={{ minHeight: "100%", padding: "32px 24px 48px", background: "#f6f6f7" }}>
      {typePickerOpen && <DiscountTypeModal onClose={() => setTypePickerOpen(false)} onSelect={(type) => { setSelectedType(type); setTypePickerOpen(false); setFormOpen(true); }} />}
      {formOpen && <DiscountForm initialDiscount={editingDiscount} selectedType={selectedType} onSave={saveDiscount} onClose={closeForm} />}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px" }}>Discounts</h1>
            <p style={{ margin: "8px 0 0", color: "#6d7175" }}>Create and manage offers for your checkout experience.</p>
          </div>
          <button type="button" onClick={() => setTypePickerOpen(true)} style={{ padding: "11px 16px", border: 0, borderRadius: "8px", background: "#303030", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Create discount</button>
        </header>

        <section style={{ border: "1px solid #e1e3e5", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "12px", padding: "16px", borderBottom: "1px solid #e1e3e5" }}>
            <input type="search" aria-label="Search discounts" placeholder="Search by title or code" value={search} onChange={(event) => setSearch(event.target.value)} style={{ flex: 1, minWidth: 0, padding: "10px 12px", border: "1px solid #c9cccf", borderRadius: "8px" }} />
            <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} style={{ padding: "10px 12px", border: "1px solid #c9cccf", borderRadius: "8px", background: "#fff" }}>
              <option>All</option><option>Active</option><option>Draft</option>
            </select>
          </div>
          <div style={{ display: "grid", gap: "12px", padding: "16px" }}>
            {visibleDiscounts.length ? visibleDiscounts.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} onEdit={(item) => { setEditingDiscount(item); setFormOpen(true); }} onDelete={(id) => setDiscounts((current) => current.filter((item) => item.id !== id))} />
            )) : (
              <div style={{ padding: "42px 20px", textAlign: "center" }}>
                <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>No discounts found</h2>
                <p style={{ margin: 0, color: "#6d7175" }}>Create a discount or adjust your search filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
