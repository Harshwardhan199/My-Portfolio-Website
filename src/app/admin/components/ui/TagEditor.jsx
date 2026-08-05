import { useState } from "react";

export default function TagEditor({
  label = "Technologies / Tags",
  tags = [],
  onChange,
  placeholder = "Type tag and press Enter...",
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInput("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2 p-2.5 bg-input-bg border border-border-theme focus-within:border-brand-red/60 rounded-xl min-h-[46px] items-center transition duration-200">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-card-dark border border-border-theme text-text-primary rounded-lg text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-text-secondary hover:text-brand-red transition cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add tag..."}
          className="flex-1 min-w-[120px] bg-transparent text-text-primary text-sm outline-none placeholder:text-text-secondary/50 px-1 py-0.5"
        />
      </div>
      <p className="text-[11px] text-text-secondary">Press Enter or comma to add tags.</p>
    </div>
  );
}
