import { useState } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import FileUpload from "../components/ui/FileUpload";
import SectionHeader from "../components/ui/SectionHeader";
import TagEditor from "../components/ui/TagEditor";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";

export default function ProjectsEditor() {
  const { data: projectsList, loading, addItem, updateItem, deleteItem, reorderItems } =
    useFirestoreCollection("draft_projects", "order");

  const [editingProject, setEditingProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const startAddNew = () => {
    setEditingProject({
      id: "",
      title: "",
      description: "",
      image: "",
      github: "",
      demo: "",
      technologies: [],
      featured: false,
      isTeam: false,
      order: projectsList.length + 1,
    });
  };

  const duplicateProject = async (proj) => {
    const copy = {
      ...proj,
      id: `proj_${Date.now()}`,
      title: `${proj.title} (Copy)`,
      order: projectsList.length + 1,
    };
    await addItem(copy);
  };

  const handleSave = async () => {
    if (!editingProject || !editingProject.title) return;

    try {
      setIsSaving(true);
      if (editingProject.id) {
        await updateItem(editingProject.id, editingProject);
      } else {
        await addItem(editingProject);
      }
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project:", err);
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

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Projects editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Projects Section Editor"
        subtitle="Manage your featured software projects, repositories, live demos, and project preview images."
        sectionKey="projects"
      >
        <button
          onClick={startAddNew}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Project
        </button>
      </SectionHeader>

      {/* Inline Form for New Project (id === "") */}
      {editingProject && editingProject.id === "" && (
        <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border-theme pb-3">
            <h3 className="text-base font-bold text-text-primary">New Project</h3>
            <button
              onClick={() => setEditingProject(null)}
              className="text-xs text-text-secondary hover:text-text-primary cursor-pointer font-semibold"
            >
              Cancel
            </button>
          </div>

          <TextField
            label="Project Title"
            value={editingProject.title}
            onChange={(val) => setEditingProject({ ...editingProject, title: val })}
            placeholder="e.g. Sage AI"
            required
          />

          <FileUpload
            label="Project Preview Image"
            accept="image/*"
            currentUrl={editingProject.image}
            onUploadSuccess={(url) => setEditingProject({ ...editingProject, image: url })}
            folder="project_images"
          />

          <TextArea
            label="Description"
            value={editingProject.description}
            onChange={(val) => setEditingProject({ ...editingProject, description: val })}
            placeholder="Detailed project summary..."
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="GitHub Repository URL"
              value={editingProject.github}
              onChange={(val) => setEditingProject({ ...editingProject, github: val })}
              placeholder="https://github.com/..."
            />

            <TextField
              label="Live Demo URL"
              value={editingProject.demo}
              onChange={(val) => setEditingProject({ ...editingProject, demo: val })}
              placeholder="https://..."
            />
          </div>

          <TagEditor
            label="Technologies & Tech Stack"
            tags={editingProject.technologies || []}
            onChange={(tags) => setEditingProject({ ...editingProject, technologies: tags })}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={editingProject.featured || false}
                onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-red cursor-pointer"
              />
              Featured Project
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={editingProject.isTeam || false}
                onChange={(e) => setEditingProject({ ...editingProject, isTeam: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-red cursor-pointer"
              />
              Team Project
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary hover:bg-border-theme/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      )}

      {/* Projects Sortable List with In-Place Edit Form */}
      <SortableList
        items={projectsList}
        onReorder={reorderItems}
        renderItem={(proj) => {
          const isEditingThisProj = editingProject && editingProject.id === proj.id;

          if (isEditingThisProj) {
            return (
              <div className="bg-card-dark border-2 border-brand-red/60 p-6 rounded-2xl space-y-6 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border-theme pb-3">
                  <h3 className="text-base font-bold text-text-primary">Edit Project: {proj.title}</h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs text-text-secondary hover:text-text-primary cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <TextField
                  label="Project Title"
                  value={editingProject.title}
                  onChange={(val) => setEditingProject({ ...editingProject, title: val })}
                  placeholder="e.g. Sage AI"
                  required
                />

                <FileUpload
                  label="Project Preview Image"
                  accept="image/*"
                  currentUrl={editingProject.image}
                  onUploadSuccess={(url) => setEditingProject({ ...editingProject, image: url })}
                  folder="project_images"
                />

                <TextArea
                  label="Description"
                  value={editingProject.description}
                  onChange={(val) => setEditingProject({ ...editingProject, description: val })}
                  placeholder="Detailed project summary..."
                  rows={4}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="GitHub Repository URL"
                    value={editingProject.github}
                    onChange={(val) => setEditingProject({ ...editingProject, github: val })}
                    placeholder="https://github.com/..."
                  />

                  <TextField
                    label="Live Demo URL"
                    value={editingProject.demo}
                    onChange={(val) => setEditingProject({ ...editingProject, demo: val })}
                    placeholder="https://..."
                  />
                </div>

                <TagEditor
                  label="Technologies & Tech Stack"
                  tags={editingProject.technologies || []}
                  onChange={(tags) => setEditingProject({ ...editingProject, technologies: tags })}
                />

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={editingProject.featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4 rounded accent-brand-red cursor-pointer"
                    />
                    Featured Project
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
                    <input
                      type="checkbox"
                      checked={editingProject.isTeam || false}
                      onChange={(e) => setEditingProject({ ...editingProject, isTeam: e.target.checked })}
                      className="w-4 h-4 rounded accent-brand-red cursor-pointer"
                    />
                    Team Project
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-input-bg border border-border-theme text-text-primary hover:bg-border-theme/40 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-red text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Project"}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-16 h-16 rounded-xl object-cover border border-border-theme shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-input-bg border border-border-theme flex items-center justify-center text-xl shrink-0">
                    🚀
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-text-primary">{proj.title}</h4>
                    {proj.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-semibold">
                        Featured
                      </span>
                    )}
                    {proj.isTeam && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-semibold">
                        Team
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(proj.technologies || []).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-input-bg text-text-secondary border border-border-theme">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => duplicateProject(proj)}
                  className="px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-medium rounded-xl cursor-pointer"
                  title="Duplicate"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => setEditingProject({ ...proj })}
                  className="px-3 py-1.5 bg-input-bg border border-border-theme hover:border-brand-red text-text-primary text-xs font-medium rounded-xl cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(proj.id)}
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
        title="Delete Project?"
        message="Are you sure you want to delete this project?"
        confirmText="Delete"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
