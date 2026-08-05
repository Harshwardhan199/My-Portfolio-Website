import { useState } from "react";
import TextField from "../components/ui/TextField";
import SectionHeader from "../components/ui/SectionHeader";
import TagEditor from "../components/ui/TagEditor";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function ExperienceEditor() {
  const { data: experienceList, loading, addItem, updateItem, deleteItem, reorderItems } =
    useFirestoreCollection("draft_experience", "order");

  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startAddNew = () => {
    setEditingItem({
      id: "",
      role: "",
      company: "",
      duration: "",
      responsibilities: [],
      technologies: [],
      order: experienceList.length + 1,
    });
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem.role || !editingItem.company) return;

    try {
      setIsSaving(true);
      if (editingItem.id) {
        await updateItem(editingItem.id, editingItem);
      } else {
        await addItem(editingItem);
      }
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving experience item:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteItem(deleteId);
      setDeleteId(null);
    }
  };

  const addResponsibility = (text) => {
    if (!text.trim()) return;
    setEditingItem({
      ...editingItem,
      responsibilities: [...(editingItem.responsibilities || []), text.trim()],
    });
  };

  const removeResponsibility = (index) => {
    setEditingItem({
      ...editingItem,
      responsibilities: editingItem.responsibilities.filter((_, idx) => idx !== index),
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Experience editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Experience Section Editor"
        subtitle="Manage your professional experience entries, responsibilities, and tech stacks."
        sectionKey="experience"
      >
        <button
          onClick={startAddNew}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Experience
        </button>
      </SectionHeader>

      {/* Inline Form for New Experience (id === "") */}
      {editingItem && editingItem.id === "" && (
        <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border-theme pb-3">
            <h3 className="text-base font-bold text-text-primary">New Experience Entry</h3>
            <button
              onClick={() => setEditingItem(null)}
              className="text-xs text-text-secondary hover:text-text-primary cursor-pointer font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextField
              label="Role / Title"
              value={editingItem.role}
              onChange={(val) => setEditingItem({ ...editingItem, role: val })}
              placeholder="e.g. DT Intern"
              required
            />

            <TextField
              label="Company / Organization"
              value={editingItem.company}
              onChange={(val) => setEditingItem({ ...editingItem, company: val })}
              placeholder="e.g. GE Appliances"
              required
            />

            <TextField
              label="Duration"
              value={editingItem.duration}
              onChange={(val) => setEditingItem({ ...editingItem, duration: val })}
              placeholder="Jan 2026 – June 2026"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Responsibilities & Key Contributions
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                id="newRespInputNew"
                placeholder="Add responsibility bullet point..."
                className="flex-1 px-4 py-2 bg-input-bg border border-border-theme rounded-xl text-xs text-text-primary outline-none focus:border-brand-red/60"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addResponsibility(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("newRespInputNew");
                  if (input) {
                    addResponsibility(input.value);
                    input.value = "";
                  }
                }}
                className="px-4 py-2 bg-input-bg border border-border-theme text-xs font-semibold rounded-xl text-text-primary hover:border-brand-red cursor-pointer"
              >
                Add Bullet
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(editingItem.responsibilities || []).map((resp, rIdx) => (
                <div key={rIdx} className="flex items-center justify-between p-2.5 bg-input-bg border border-border-theme rounded-xl text-xs gap-3">
                  <span className="text-text-primary flex-1">{resp}</span>
                  <button
                    onClick={() => removeResponsibility(rIdx)}
                    className="text-brand-red hover:underline font-semibold text-[11px] cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <TagEditor
            label="Technologies & Tools Used"
            tags={editingItem.technologies || []}
            onChange={(tags) => setEditingItem({ ...editingItem, technologies: tags })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary hover:bg-border-theme/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Experience"}
            </button>
          </div>
        </div>
      )}

      {/* Experience Cards List with In-Place Edit Form */}
      <SortableList
        items={experienceList}
        onReorder={reorderItems}
        renderItem={(exp) => {
          const isEditingThisExp = editingItem && editingItem.id === exp.id;

          if (isEditingThisExp) {
            return (
              <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border-theme pb-3">
                  <h3 className="text-base font-bold text-text-primary">
                    Edit Experience: {exp.role} @ {exp.company}
                  </h3>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-xs text-text-secondary hover:text-text-primary cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField
                    label="Role / Title"
                    value={editingItem.role}
                    onChange={(val) => setEditingItem({ ...editingItem, role: val })}
                    placeholder="e.g. DT Intern"
                    required
                  />

                  <TextField
                    label="Company / Organization"
                    value={editingItem.company}
                    onChange={(val) => setEditingItem({ ...editingItem, company: val })}
                    placeholder="e.g. GE Appliances"
                    required
                  />

                  <TextField
                    label="Duration"
                    value={editingItem.duration}
                    onChange={(val) => setEditingItem({ ...editingItem, duration: val })}
                    placeholder="Jan 2026 – June 2026"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Responsibilities & Key Contributions
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      id={`newRespInput_${exp.id}`}
                      placeholder="Add responsibility bullet point..."
                      className="flex-1 px-4 py-2 bg-input-bg border border-border-theme rounded-xl text-xs text-text-primary outline-none focus:border-brand-red/60"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addResponsibility(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(`newRespInput_${exp.id}`);
                        if (input) {
                          addResponsibility(input.value);
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-input-bg border border-border-theme text-xs font-semibold rounded-xl text-text-primary hover:border-brand-red cursor-pointer"
                    >
                      Add Bullet
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(editingItem.responsibilities || []).map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-center justify-between p-2.5 bg-input-bg border border-border-theme rounded-xl text-xs gap-3">
                        <span className="text-text-primary flex-1">{resp}</span>
                        <button
                          onClick={() => removeResponsibility(rIdx)}
                          className="text-brand-red hover:underline font-semibold text-[11px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <TagEditor
                  label="Technologies & Tools Used"
                  tags={editingItem.technologies || []}
                  onChange={(tags) => setEditingItem({ ...editingItem, technologies: tags })}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary hover:bg-border-theme/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Experience"}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-text-primary">{exp.role}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                    {exp.company}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{exp.duration}</p>
                <p className="text-xs text-text-secondary line-clamp-1">
                  {exp.responsibilities?.length || 0} Responsibilities · {exp.technologies?.length || 0} Technologies
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => setEditingItem({ ...exp })}
                  className="px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-medium rounded-xl cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(exp.id)}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs font-medium rounded-xl cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        }}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Experience Entry?"
        message="Are you sure you want to delete this experience entry?"
        confirmText="Delete"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
