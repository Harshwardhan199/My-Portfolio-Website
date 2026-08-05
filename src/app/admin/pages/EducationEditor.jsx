import { useState } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import SectionHeader from "../components/ui/SectionHeader";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function EducationEditor() {
  const { data: list, loading, addItem, updateItem, deleteItem, reorderItems } =
    useFirestoreCollection("draft_education", "order");

  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startAddNew = () => {
    setEditingItem({
      id: "",
      degree: "",
      institution: "",
      duration: "",
      highlights: "",
      order: list.length + 1,
    });
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem.degree || !editingItem.institution) return;

    try {
      setIsSaving(true);
      if (editingItem.id) {
        await updateItem(editingItem.id, editingItem);
      } else {
        await addItem(editingItem);
      }
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving education item:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Education editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Education Section Editor"
        subtitle="Manage academic degrees, universities, institutions, and educational highlights."
        sectionKey="education"
      >
        <button
          onClick={startAddNew}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Education
        </button>
      </SectionHeader>

      {/* Inline Form for New Education Entry (id === "") */}
      {editingItem && editingItem.id === "" && (
        <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border-theme pb-3">
            <h3 className="text-base font-bold text-text-primary">New Education Entry</h3>
            <button onClick={() => setEditingItem(null)} className="text-xs text-text-secondary cursor-pointer font-semibold">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextField
              label="Degree / Course"
              value={editingItem.degree}
              onChange={(val) => setEditingItem({ ...editingItem, degree: val })}
              placeholder="Bachelor of Technology in CS"
              required
            />
            <TextField
              label="Institution / University"
              value={editingItem.institution}
              onChange={(val) => setEditingItem({ ...editingItem, institution: val })}
              placeholder="NIIT University"
              required
            />
            <TextField
              label="Duration"
              value={editingItem.duration}
              onChange={(val) => setEditingItem({ ...editingItem, duration: val })}
              placeholder="2022 - 2026"
            />
          </div>

          <TextArea
            label="Highlights / Notes"
            value={editingItem.highlights}
            onChange={(val) => setEditingItem({ ...editingItem, highlights: val })}
            placeholder="Specialization in backend systems and artificial intelligence..."
            rows={3}
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

      {/* Education Cards List with In-Place Edit Form */}
      <SortableList
        items={list}
        onReorder={reorderItems}
        renderItem={(item) => {
          const isEditingThisItem = editingItem && editingItem.id === item.id;

          if (isEditingThisItem) {
            return (
              <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border-theme pb-3">
                  <h3 className="text-base font-bold text-text-primary">Edit Education: {item.degree}</h3>
                  <button onClick={() => setEditingItem(null)} className="text-xs text-text-secondary cursor-pointer font-semibold">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField
                    label="Degree / Course"
                    value={editingItem.degree}
                    onChange={(val) => setEditingItem({ ...editingItem, degree: val })}
                    placeholder="Bachelor of Technology in CS"
                    required
                  />
                  <TextField
                    label="Institution / University"
                    value={editingItem.institution}
                    onChange={(val) => setEditingItem({ ...editingItem, institution: val })}
                    placeholder="NIIT University"
                    required
                  />
                  <TextField
                    label="Duration"
                    value={editingItem.duration}
                    onChange={(val) => setEditingItem({ ...editingItem, duration: val })}
                    placeholder="2022 - 2026"
                  />
                </div>

                <TextArea
                  label="Highlights / Notes"
                  value={editingItem.highlights}
                  onChange={(val) => setEditingItem({ ...editingItem, highlights: val })}
                  placeholder="Specialization in backend systems and artificial intelligence..."
                  rows={3}
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
                <h4 className="text-base font-bold text-text-primary">{item.degree}</h4>
                <p className="text-xs text-brand-red font-semibold">{item.institution} · {item.duration}</p>
                <p className="text-xs text-text-secondary mt-1">{item.highlights}</p>
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
        title="Delete Education Entry?"
        message="Are you sure you want to delete this education entry?"
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
