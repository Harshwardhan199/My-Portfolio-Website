import { useState } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import SectionHeader from "../components/ui/SectionHeader";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function AchievementsEditor() {
  const { data: list, loading, addItem, updateItem, deleteItem, reorderItems } =
    useFirestoreCollection("draft_achievements", "order");

  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startAddNew = () => {
    setEditingItem({
      id: "",
      title: "",
      description: "",
      date: "",
      url: "",
      order: list.length + 1,
    });
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem.title) return;

    try {
      setIsSaving(true);
      if (editingItem.id) {
        await updateItem(editingItem.id, editingItem);
      } else {
        await addItem(editingItem);
      }
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving achievement:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Achievements editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Achievements Section Editor"
        subtitle="Manage honors, awards, hackathon wins, and key milestones."
        sectionKey="achievements"
      >
        <button
          onClick={startAddNew}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Achievement
        </button>
      </SectionHeader>

      {/* Inline Form for New Achievement Entry (id === "") */}
      {editingItem && editingItem.id === "" && (
        <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border-theme pb-3">
            <h3 className="text-base font-bold text-text-primary">New Achievement Entry</h3>
            <button onClick={() => setEditingItem(null)} className="text-xs text-text-secondary cursor-pointer font-semibold">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Achievement Title"
              value={editingItem.title}
              onChange={(val) => setEditingItem({ ...editingItem, title: val })}
              placeholder="e.g. 1st Place National Hackathon"
              required
            />
            <TextField
              label="Date / Year"
              value={editingItem.date}
              onChange={(val) => setEditingItem({ ...editingItem, date: val })}
              placeholder="2025"
            />
          </div>

          <TextArea
            label="Description"
            value={editingItem.description}
            onChange={(val) => setEditingItem({ ...editingItem, description: val })}
            placeholder="Details about the award or milestone..."
            rows={3}
          />

          <TextField
            label="Link / Article URL"
            value={editingItem.url}
            onChange={(val) => setEditingItem({ ...editingItem, url: val })}
            placeholder="https://..."
          />

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50">
              {isSaving ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </div>
      )}

      {/* Achievements Cards List with In-Place Edit Form */}
      <SortableList
        items={list}
        onReorder={reorderItems}
        renderItem={(item) => {
          const isEditingThisItem = editingItem && editingItem.id === item.id;

          if (isEditingThisItem) {
            return (
              <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border-theme pb-3">
                  <h3 className="text-base font-bold text-text-primary">Edit Achievement: {item.title}</h3>
                  <button onClick={() => setEditingItem(null)} className="text-xs text-text-secondary cursor-pointer font-semibold">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Achievement Title"
                    value={editingItem.title}
                    onChange={(val) => setEditingItem({ ...editingItem, title: val })}
                    placeholder="e.g. 1st Place National Hackathon"
                    required
                  />
                  <TextField
                    label="Date / Year"
                    value={editingItem.date}
                    onChange={(val) => setEditingItem({ ...editingItem, date: val })}
                    placeholder="2025"
                  />
                </div>

                <TextArea
                  label="Description"
                  value={editingItem.description}
                  onChange={(val) => setEditingItem({ ...editingItem, description: val })}
                  placeholder="Details about the award or milestone..."
                  rows={3}
                />

                <TextField
                  label="Link / Article URL"
                  value={editingItem.url}
                  onChange={(val) => setEditingItem({ ...editingItem, url: val })}
                  placeholder="https://..."
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50">
                    {isSaving ? "Saving..." : "Save Entry"}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-2 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-base font-bold text-text-primary">{item.title}</h4>
                <p className="text-xs text-brand-red font-semibold">{item.date}</p>
                <p className="text-xs text-text-secondary mt-1">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button onClick={() => setEditingItem({ ...item })} className="px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-medium rounded-xl cursor-pointer">
                  Edit
                </button>
                <button onClick={() => setDeleteId(item.id)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs font-medium rounded-xl cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          );
        }}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Achievement Entry?"
        message="Are you sure you want to delete this achievement?"
        confirmText="Delete"
        isDanger
        onConfirm={async () => {
          if (deleteId) {
            await deleteItem(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
