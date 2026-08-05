import { useState, useEffect } from "react";
import TextField from "../components/ui/TextField";
import TextArea from "../components/ui/TextArea";
import SectionHeader from "../components/ui/SectionHeader";
import SortableList from "../components/ui/SortableList";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

export default function AboutEditor() {
  const { data: aboutData, loading, saveDoc } = useFirestoreDoc("draft_portfolio", "about");
  const [cards, setCards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (aboutData && aboutData.cards) {
      setCards(aboutData.cards);
    }
  }, [aboutData]);

  const handleSave = async (updatedCards = cards) => {
    try {
      setIsSaving(true);
      await saveDoc({ cards: updatedCards });
    } catch (err) {
      console.error("Error saving About cards:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const addCard = () => {
    const newCard = {
      id: `about_${Date.now()}`,
      emoji: "🎓",
      title: "New Section",
      description: "Description text goes here...",
      order: cards.length + 1,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    handleSave(updated);
  };

  const updateCard = (index, field, value) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updated = cards.filter((_, idx) => idx !== deleteIndex);
      setCards(updated);
      setDeleteIndex(null);
      handleSave(updated);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-text-secondary">Loading About editor...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="About Section Editor"
        subtitle="Manage Bento cards (Education, Focus, Philosophy, etc.) displayed on your about section."
        sectionKey="about"
      >
        <button
          onClick={addCard}
          className="px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          + Add Card
        </button>
      </SectionHeader>

      <SortableList
        items={cards}
        onReorder={(reordered) => {
          const updated = reordered.map((item, idx) => ({ ...item, order: idx + 1 }));
          setCards(updated);
          handleSave(updated);
        }}
        renderItem={(card, idx) => (
          <div className="bg-card-dark border border-border-theme p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-theme pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Card #{idx + 1}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-3 py-1 bg-brand-red text-white text-xs font-semibold rounded-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Card"}
                </button>
                <button
                  onClick={() => setDeleteIndex(idx)}
                  className="text-xs text-brand-red font-semibold hover:underline cursor-pointer"
                >
                  Delete Card
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <TextField
                label="Emoji / Icon"
                value={card.emoji}
                onChange={(val) => updateCard(idx, "emoji", val)}
                placeholder="🎓"
                className="sm:col-span-1"
              />
              <TextField
                label="Title"
                value={card.title}
                onChange={(val) => updateCard(idx, "title", val)}
                placeholder="Title..."
                className="sm:col-span-3"
              />
            </div>

            <TextArea
              label="Description"
              value={card.description}
              onChange={(val) => updateCard(idx, "description", val)}
              placeholder="Card description text..."
              rows={3}
            />
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        title="Delete Card?"
        message="Are you sure you want to delete this About card?"
        confirmText="Delete"
        isDanger
        onConfirm={handleDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
