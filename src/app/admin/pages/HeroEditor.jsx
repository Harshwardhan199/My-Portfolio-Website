import { useState, useEffect } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import FileUpload from "../components/ui/FileUpload";
import SectionHeader from "../components/ui/SectionHeader";
import SortableList from "../components/ui/SortableList";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

export default function HeroEditor() {
  const { data: heroData, loading, saveDoc } = useFirestoreDoc("draft_portfolio", "hero");
  const [form, setForm] = useState({
    name: "",
    roles: [],
    subtexts: [],
    profileImage: "",
    resumeUrl: "",
    github: "",
    linkedin: "",
  });
  const [newRole, setNewRole] = useState("");
  const [newEmoji, setNewEmoji] = useState("💻");
  const [newSubtext, setNewSubtext] = useState("");
  const [savingField, setSavingField] = useState("");

  useEffect(() => {
    if (heroData) {
      setForm({
        name: heroData.name || "",
        roles: heroData.roles || [],
        subtexts: heroData.subtexts || [],
        profileImage: heroData.profileImage || "",
        resumeUrl: heroData.resumeUrl || "",
        github: heroData.github || "",
        linkedin: heroData.linkedin || "",
      });
    }
  }, [heroData]);

  const savePartial = async (updatedFields, keyName) => {
    try {
      setSavingField(keyName);
      const merged = { ...form, ...updatedFields };
      setForm(merged);
      await saveDoc(merged);
    } catch (err) {
      console.error(`Error saving ${keyName}:`, err);
    } finally {
      setSavingField("");
    }
  };

  const addRole = async () => {
    if (newRole.trim() && !form.roles.includes(newRole.trim())) {
      const updated = [...form.roles, newRole.trim()];
      setNewRole("");
      await savePartial({ roles: updated }, "roles");
    }
  };

  const removeRole = async (idx) => {
    const updated = form.roles.filter((_, i) => i !== idx);
    await savePartial({ roles: updated }, "roles");
  };

  const addSubtext = async () => {
    if (newSubtext.trim()) {
      const updated = [...form.subtexts, { emoji: newEmoji || "💻", text: newSubtext.trim() }];
      setNewSubtext("");
      await savePartial({ subtexts: updated }, "subtexts");
    }
  };

  const removeSubtext = async (idx) => {
    const updated = form.subtexts.filter((_, i) => i !== idx);
    await savePartial({ subtexts: updated }, "subtexts");
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Hero editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Hero Section Editor"
        subtitle="Manage your hero header, rotating title roles, subtext items, profile image, and resume PDF."
        sectionKey="hero"
      />

      {/* Personal Information & Media Card */}
      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-theme pb-3">
          <h3 className="text-base font-bold text-text-primary">
            Personal Information & Media
          </h3>
          <button
            onClick={() => savePartial({ name: form.name, github: form.github, linkedin: form.linkedin }, "personal")}
            disabled={savingField === "personal"}
            className="px-4 py-1.5 bg-brand-red text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {savingField === "personal" ? "Saving..." : "Save Info"}
          </button>
        </div>

        {/* Top Grid: Full Name & Resume (Left Column) vs Profile Image (Right Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col justify-between space-y-6 h-full">
            <TextField
              label="Full Name"
              value={form.name}
              onChange={(val) => setForm({ ...form, name: val })}
              placeholder="e.g. Harshwardhan Saini"
            />

            {/* Resume PDF File Upload (Auto-saves on select) */}
            <FileUpload
              label="Resume Document (PDF)"
              accept="application/pdf"
              currentUrl={form.resumeUrl}
              onUploadSuccess={(url) => savePartial({ resumeUrl: url }, "resume")}
            />
          </div>

          <div className="h-full flex flex-col justify-between">
            {/* Circular Profile Image File Upload (Auto-saves on crop) */}
            <FileUpload
              label="Profile Image"
              accept="image/*"
              currentUrl={form.profileImage}
              onUploadSuccess={(url) => savePartial({ profileImage: url }, "avatar")}
              isCircular={true}
            />
          </div>
        </div>

        {/* Bottom Grid: GitHub URL (Left) vs LinkedIn URL (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-theme">
          <TextField
            label="GitHub URL"
            value={form.github}
            onChange={(val) => setForm({ ...form, github: val })}
            placeholder="https://github.com/..."
          />

          <TextField
            label="LinkedIn URL"
            value={form.linkedin}
            onChange={(val) => setForm({ ...form, linkedin: val })}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      {/* Rotating Roles Section */}
      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary border-b border-border-theme pb-3">
          Rotating Role Titles (Typing Animation)
        </h3>

        <div className="flex gap-3">
          <TextField
            value={newRole}
            onChange={setNewRole}
            placeholder="Add new role title (e.g. Backend Engineer)..."
          />
          <button
            onClick={addRole}
            disabled={savingField === "roles"}
            className="px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer self-end h-[42px] shrink-0 disabled:opacity-50"
          >
            {savingField === "roles" ? "Saving..." : "Add & Save Role"}
          </button>
        </div>

        <SortableList
          items={form.roles.map((r, i) => ({ id: `role_${i}`, title: r }))}
          onReorder={(newItems) => savePartial({ roles: newItems.map((i) => i.title) }, "roles")}
          renderItem={(item, idx) => (
            <div className="flex items-center justify-between p-3 bg-input-bg border border-border-theme rounded-xl">
              <span className="text-sm font-medium text-text-primary">{item.title}</span>
              <button
                onClick={() => removeRole(idx)}
                className="text-xs text-brand-red font-semibold hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        />
      </div>

      {/* Subtext Bullet Cards */}
      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-text-primary border-b border-border-theme pb-3">
          Hero Subtext Highlights
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <TextField
            label="Emoji"
            value={newEmoji}
            onChange={setNewEmoji}
            placeholder="💻"
            className="sm:w-24"
          />
          <TextArea
            label="Description Text"
            value={newSubtext}
            onChange={setNewSubtext}
            placeholder="Subtext point..."
            rows={2}
            className="flex-1"
          />
          <button
            onClick={addSubtext}
            disabled={savingField === "subtexts"}
            className="px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer self-end h-[42px] shrink-0 disabled:opacity-50"
          >
            {savingField === "subtexts" ? "Saving..." : "Add & Save Subtext"}
          </button>
        </div>

        <div className="space-y-3">
          {form.subtexts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-4 bg-input-bg border border-border-theme rounded-xl gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.emoji}</span>
                <p className="text-sm text-text-primary mt-0.5">{item.text}</p>
              </div>
              <button
                onClick={() => removeSubtext(idx)}
                className="text-xs text-brand-red font-semibold hover:underline cursor-pointer shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
