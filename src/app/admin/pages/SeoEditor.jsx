import { useState, useEffect } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import SectionHeader from "../components/ui/SectionHeader";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

export default function SeoEditor() {
  const { data: seoData, loading, saveDoc } = useFirestoreDoc("draft_portfolio", "seo");
  const [form, setForm] = useState({
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (seoData) {
      setForm({
        title: seoData.title || "",
        description: seoData.description || "",
        keywords: seoData.keywords || "",
        ogImage: seoData.ogImage || "",
      });
    }
  }, [seoData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveDoc(form);
    } catch (err) {
      console.error("Error saving SEO metadata:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading SEO editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="SEO Metadata Editor"
        subtitle="Manage page titles, meta description tags, search keywords, and Open Graph share previews."
        sectionKey="seo"
      />

      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-theme pb-3">
          <h3 className="text-base font-bold text-text-primary">
            SEO & Open Graph Metadata
          </h3>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-brand-red text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>

        <TextField
          label="Page Title Tag (<title>)"
          value={form.title}
          onChange={(val) => setForm({ ...form, title: val })}
          placeholder="Harshwardhan Saini | Software Engineer & AI Architect"
          required
        />

        <TextArea
          label="Meta Description Tag"
          value={form.description}
          onChange={(val) => setForm({ ...form, description: val })}
          placeholder="Software Developer specializing in backend engineering, distributed systems, and AI agents..."
          rows={3}
        />

        <TextField
          label="Search Keywords (comma-separated)"
          value={form.keywords}
          onChange={(val) => setForm({ ...form, keywords: val })}
          placeholder="Harshwardhan Saini, Software Engineer, React, Node.js, AI, Full Stack"
        />

        <TextField
          label="Open Graph Image URL (og:image)"
          value={form.ogImage}
          onChange={(val) => setForm({ ...form, ogImage: val })}
          placeholder="https://.../og-preview.png"
          helper="Recommended resolution: 1200 x 630 pixels."
        />
      </div>
    </div>
  );
}
