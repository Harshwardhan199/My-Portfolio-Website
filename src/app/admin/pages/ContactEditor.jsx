import { useState, useEffect } from "react";
import TextField from "../components/ui/TextField";
import SectionHeader from "../components/ui/SectionHeader";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

export default function ContactEditor() {
  const { data: contactData, loading, saveDoc } = useFirestoreDoc("draft_portfolio", "contact");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    location: "",
    formEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contactData) {
      setForm({
        email: contactData.email || "",
        phone: contactData.phone || "",
        location: contactData.location || "",
        formEnabled: contactData.formEnabled ?? true,
      });
    }
  }, [contactData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveDoc(form);
    } catch (err) {
      console.error("Error saving contact data:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading Contact editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Contact Information Editor"
        subtitle="Manage contact email, phone, location details, and form settings."
        sectionKey="contact"
      />

      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border-theme pb-3">
          <h3 className="text-base font-bold text-text-primary">
            Contact Details & Settings
          </h3>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-brand-red text-white text-xs font-semibold rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Contact Info"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Contact Email"
            value={form.email}
            onChange={(val) => setForm({ ...form, email: val })}
            placeholder="your-email@example.com"
            required
          />

          <TextField
            label="Phone Number"
            value={form.phone}
            onChange={(val) => setForm({ ...form, phone: val })}
            placeholder="+1 234 567 890"
          />

          <TextField
            label="Location / Country"
            value={form.location}
            onChange={(val) => setForm({ ...form, location: val })}
            placeholder="India"
          />
        </div>

        <div className="pt-2 border-t border-border-theme">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
            <input
              type="checkbox"
              checked={form.formEnabled}
              onChange={(e) => setForm({ ...form, formEnabled: e.target.checked })}
              className="w-4 h-4 rounded accent-brand-red cursor-pointer"
            />
            Enable Public Contact Form Submission
          </label>
        </div>
      </div>
    </div>
  );
}
