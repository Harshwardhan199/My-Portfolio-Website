import { useState } from "react";
import TextField from "../components/ui/TextField";
import SectionHeader from "../components/ui/SectionHeader";
import IconPicker from "../components/ui/IconPicker";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function SkillsEditor() {
  const { data: skillCategories, loading, addItem, updateItem, deleteItem, reorderItems } =
    useFirestoreCollection("draft_skills", "order");

  const [newCatName, setNewCatName] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [deleteCatId, setDeleteCatId] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await addItem({
      category: newCatName.trim(),
      items: [],
      order: skillCategories.length + 1,
    });
    setNewCatName("");
  };

  const renameCategory = async (catId, newName) => {
    if (!newName.trim()) return;
    await updateItem(catId, { category: newName.trim() });
  };

  const toggleCollapse = (catId) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const saveSkillItem = async () => {
    if (!editingSkill) return;
    const { catId, skillIdx, item } = editingSkill;
    const categoryObj = skillCategories.find((c) => c.id === catId);
    if (!categoryObj) return;

    let updatedItems = [...(categoryObj.items || [])];

    if (skillIdx !== null && skillIdx >= 0) {
      updatedItems[skillIdx] = item;
    } else {
      updatedItems.push({
        ...item,
        id: `skill_${Date.now()}`,
        order: updatedItems.length + 1,
      });
    }

    await updateItem(catId, { items: updatedItems });
    setEditingSkill(null);
  };

  const deleteSkillItem = async (catId, skillIdx) => {
    const categoryObj = skillCategories.find((c) => c.id === catId);
    if (!categoryObj) return;

    const updatedItems = categoryObj.items.filter((_, idx) => idx !== skillIdx);
    await updateItem(catId, { items: updatedItems });
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Skills editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Skills Section Editor"
        subtitle="Manage skill categories and individual skill entries with centralized icon selection."
        sectionKey="skills"
      />

      {/* Add New Category Header */}
      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
        <TextField
          label="New Category Name"
          value={newCatName}
          onChange={setNewCatName}
          placeholder="e.g. AI & Machine Learning..."
          className="flex-1"
        />
        <button
          onClick={addCategory}
          className="px-5 py-2.5 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer shrink-0"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Reorderable List */}
      <SortableList
        items={skillCategories}
        onReorder={reorderItems}
        renderItem={(cat) => (
          <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-4 shadow-sm">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-border-theme pb-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <input
                  type="text"
                  defaultValue={cat.category}
                  onBlur={(e) => renameCategory(cat.id, e.target.value)}
                  className="text-base font-bold text-text-primary bg-transparent border border-transparent hover:border-border-theme focus:border-brand-red/60 px-2 py-1 rounded-lg outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setEditingSkill({
                      catId: cat.id,
                      skillIdx: null,
                      item: { name: "", description: "", iconId: "", order: (cat.items?.length || 0) + 1 },
                    })
                  }
                  className="px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-medium rounded-xl cursor-pointer"
                >
                  + Add Skill
                </button>

                <button
                  onClick={() => toggleCollapse(cat.id)}
                  className="p-1.5 rounded-xl bg-input-bg border border-border-theme text-text-secondary hover:text-text-primary cursor-pointer text-xs"
                >
                  {collapsed[cat.id] ? "Expand" : "Collapse"}
                </button>

                <button
                  onClick={() => setDeleteCatId(cat.id)}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 text-xs font-medium rounded-xl cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Category Skills List */}
            {!collapsed[cat.id] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {(cat.items || []).map((skill, sIdx) => (
                  <div
                    key={skill.id || sIdx}
                    className="p-4 bg-input-bg border border-border-theme rounded-xl flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconPicker
                        selectedIconId={skill.iconId}
                        onSelect={async (newIconId) => {
                          const updated = [...cat.items];
                          updated[sIdx] = { ...updated[sIdx], iconId: newIconId };
                          await updateItem(cat.id, { items: updated });
                        }}
                      />
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold text-text-primary truncate">{skill.name}</h5>
                        <p className="text-xs text-text-secondary truncate">{skill.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setEditingSkill({ catId: cat.id, skillIdx: sIdx, item: { ...skill } })}
                        className="p-1 text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                        title="Edit Skill"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteSkillItem(cat.id, sIdx)}
                        className="p-1 text-xs text-brand-red font-bold hover:underline cursor-pointer"
                        title="Delete Skill"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />

      {/* Edit Skill Item Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card-dark border border-border-theme p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-text-primary">
              {editingSkill.skillIdx !== null ? "Edit Skill" : "Add New Skill"}
            </h3>

            <TextField
              label="Skill Name"
              value={editingSkill.item.name}
              onChange={(val) => setEditingSkill({ ...editingSkill, item: { ...editingSkill.item, name: val } })}
              placeholder="e.g. React"
              required
            />

            <TextField
              label="Description / Subtext"
              value={editingSkill.item.description}
              onChange={(val) => setEditingSkill({ ...editingSkill, item: { ...editingSkill.item, description: val } })}
              placeholder="e.g. Component-Based UI"
            />

            <IconPicker
              selectedIconId={editingSkill.item.iconId}
              onSelect={(iconId) => setEditingSkill({ ...editingSkill, item: { ...editingSkill.item, iconId } })}
            />

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setEditingSkill(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveSkillItem}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteCatId !== null}
        title="Delete Category?"
        message="Are you sure you want to delete this entire category and all skills contained inside it?"
        confirmText="Delete Category"
        isDanger
        onConfirm={async () => {
          if (deleteCatId) {
            await deleteItem(deleteCatId);
            setDeleteCatId(null);
          }
        }}
        onCancel={() => setDeleteCatId(null)}
      />
    </div>
  );
}
