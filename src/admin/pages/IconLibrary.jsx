import { useState } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import SectionHeader from "../components/ui/SectionHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useIconLibrary } from "../hooks/useIconLibrary";

export default function IconLibrary() {
  const { icons, loading, addIcon, updateIcon, deleteIcon } = useIconLibrary();
  const [search, setSearch] = useState("");
  const [editingIcon, setEditingIcon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const startAddNew = () => {
    setEditingIcon({
      id: "",
      name: "",
      category: "General",
      url: "",
      svgCode: "",
      keywords: "",
    });
  };

  const handleSave = async () => {
    if (!editingIcon || !editingIcon.name) return;

    try {
      const id = editingIcon.id || editingIcon.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const payload = {
        ...editingIcon,
        id,
      };

      if (editingIcon.isNew) {
        await addIcon(payload);
      } else {
        await updateIcon(id, payload);
      }
      setEditingIcon(null);
    } catch (err) {
      console.error("Error saving icon:", err);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteIcon(deleteId);
      setDeleteId(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredIcons = icons.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.name?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      i.keywords?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Centralized Icon Library...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Centralized Icon Library"
        subtitle="Manage shared icons referenced by skills, tools, and social links across the portfolio."
      >
        <button
          onClick={startAddNew}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Icon
        </button>
      </SectionHeader>

      {/* Filter / Search Bar */}
      <div className="bg-card-dark border border-border-theme p-4 rounded-2xl flex items-center gap-3">
        <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, category, or search aliases..."
          className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/50"
        />
      </div>

      {/* Edit Modal */}
      {editingIcon && (
        <div className="bg-card-dark border border-brand-red/40 p-6 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-border-theme pb-3">
            <h3 className="text-lg font-bold text-text-primary">
              {editingIcon.id ? "Edit Icon Entry" : "New Icon Entry"}
            </h3>
            <button onClick={() => setEditingIcon(null)} className="text-xs text-text-secondary cursor-pointer">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Icon Name"
              value={editingIcon.name}
              onChange={(val) => setEditingIcon({ ...editingIcon, name: val })}
              placeholder="e.g. React"
              required
            />
            <TextField
              label="Category"
              value={editingIcon.category}
              onChange={(val) => setEditingIcon({ ...editingIcon, category: val })}
              placeholder="Frontend, Cloud, Database..."
            />
          </div>

          <TextField
            label="Image Icon URL"
            value={editingIcon.url}
            onChange={(val) => setEditingIcon({ ...editingIcon, url: val })}
            placeholder="https://img.icons8.com/..."
          />

          <TextArea
            label="SVG Code (Optional)"
            value={editingIcon.svgCode}
            onChange={(val) => setEditingIcon({ ...editingIcon, svgCode: val })}
            placeholder="<svg>...</svg>"
            rows={3}
          />

          <TextField
            label="Search Keywords & Aliases"
            value={editingIcon.keywords}
            onChange={(val) => setEditingIcon({ ...editingIcon, keywords: val })}
            placeholder="react, frontend, component, jsx"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditingIcon(null)} className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer">
              Save Icon
            </button>
          </div>
        </div>
      )}

      {/* Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredIcons.map((icon) => (
          <div
            key={icon.id}
            className="bg-card-dark border border-border-theme hover:border-brand-red/40 p-4 rounded-2xl flex flex-col items-center justify-between text-center gap-3 transition shadow-sm group relative"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-input-bg rounded-xl p-2 border border-border-theme">
              {icon.url ? (
                <img src={icon.url} alt={icon.name} className="w-8 h-8 object-contain theme-icon-invert" />
              ) : icon.svgCode ? (
                <div dangerouslySetInnerHTML={{ __html: icon.svgCode }} className="w-8 h-8 flex items-center justify-center" />
              ) : (
                <span className="text-base font-bold text-text-secondary">?</span>
              )}
            </div>

            <div className="space-y-0.5 w-full">
              <h5 className="text-xs font-bold text-text-primary truncate w-full">{icon.name}</h5>
              <p className="text-[10px] text-text-secondary truncate w-full">{icon.category || "General"}</p>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-border-theme w-full justify-center">
              <button
                onClick={() => setEditingIcon({ ...icon })}
                className="p-1 text-[11px] text-text-secondary hover:text-text-primary cursor-pointer"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => copyToClipboard(icon.url || icon.id, icon.id)}
                className="p-1 text-[11px] text-text-secondary hover:text-text-primary cursor-pointer"
                title="Copy Link/ID"
              >
                {copiedId === icon.id ? "✓" : "📋"}
              </button>
              <button
                onClick={() => setDeleteId(icon.id)}
                className="p-1 text-[11px] text-brand-red font-bold hover:underline cursor-pointer"
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Shared Icon?"
        message="Are you sure you want to delete this icon from the centralized library? Skills and projects referencing this icon will revert to default."
        confirmText="Delete Icon"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
