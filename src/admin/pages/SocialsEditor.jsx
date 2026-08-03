import { useState, useEffect } from "react";
import TextField from "../components/ui/TextField";
import SectionHeader from "../components/ui/SectionHeader";
import IconPicker from "../components/ui/IconPicker";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

export default function SocialsEditor() {
  const { data: socialsData, loading, saveDoc } = useFirestoreDoc("draft_portfolio", "socials");
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (socialsData && socialsData.items) {
      setItems(socialsData.items);
    }
  }, [socialsData]);

  const handleSave = async (updatedItems = items) => {
    try {
      setIsSaving(true);
      await saveDoc({ items: updatedItems });
    } catch (err) {
      console.error("Error saving social links:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    const newItem = {
      id: `soc_${Date.now()}`,
      platform: "Twitter / X",
      url: "https://x.com/...",
      iconId: "github",
      order: items.length + 1,
    };
    const updated = [...items, newItem];
    setItems(updated);
    handleSave(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updated = items.filter((_, idx) => idx !== deleteIndex);
      setItems(updated);
      setDeleteIndex(null);
      handleSave(updated);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Social Links editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Social Links Editor"
        subtitle="Manage reusable social media links (GitHub, LinkedIn, Twitter/X, etc.) across your portfolio."
        sectionKey="socials"
      >
        <button
          onClick={addItem}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Social Link
        </button>
      </SectionHeader>

      <SortableList
        items={items}
        onReorder={(reordered) => {
          const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
          setItems(updated);
          handleSave(updated);
        }}
        renderItem={(item, idx) => (
          <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-theme pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Link #{idx + 1}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-3 py-1 bg-brand-red text-white text-xs font-semibold rounded-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Link"}
                </button>
                <button
                  onClick={() => setDeleteIndex(idx)}
                  className="text-xs text-brand-red font-semibold hover:underline cursor-pointer"
                >
                  Delete Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextField
                label="Platform Name"
                value={item.platform}
                onChange={(val) => updateItem(idx, "platform", val)}
                placeholder="e.g. GitHub"
              />
              <TextField
                label="Profile URL"
                value={item.url}
                onChange={(val) => updateItem(idx, "url", val)}
                placeholder="https://..."
              />
              <IconPicker
                label="Platform Icon"
                selectedIconId={item.iconId}
                onSelect={(iconId) => {
                  updateItem(idx, "iconId", iconId);
                  const updated = [...items];
                  updated[idx] = { ...updated[idx], iconId };
                  handleSave(updated);
                }}
              />
            </div>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Delete Social Link?"
        message="Are you sure you want to delete this social link?"
        confirmText="Delete"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
