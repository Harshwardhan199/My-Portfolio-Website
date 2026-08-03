import { useState } from "react";
import { useIconLibrary } from "../../hooks/useIconLibrary";

export default function IconPicker({
  selectedIconId,
  onSelect,
  label = "Icon",
}) {
  const { icons, loading, getIcon } = useIconLibrary();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentIcon = getIcon(selectedIconId);

  const filteredIcons = icons.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.name?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      i.keywords?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-input-bg border border-border-theme hover:border-brand-red/60 rounded-xl text-text-primary text-sm transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {currentIcon?.url ? (
              <img
                src={currentIcon.url}
                alt={currentIcon.name}
                className="w-6 h-6 object-contain theme-icon-invert"
              />
            ) : (
              <div className="w-6 h-6 rounded bg-card-dark border border-border-theme flex items-center justify-center text-xs font-mono text-text-secondary">
                ?
              </div>
            )}
            <span className="font-medium">
              {currentIcon ? currentIcon.name : selectedIconId || "Select an Icon"}
            </span>
          </div>
          <span className="text-xs text-text-secondary">Change</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-card-dark border border-border-theme rounded-2xl shadow-2xl p-4 space-y-3 max-h-80 overflow-y-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icon name, category, keyword..."
              className="w-full px-3 py-2 bg-input-bg border border-border-theme rounded-xl text-xs text-text-primary outline-none focus:border-brand-red/60"
            />

            {loading ? (
              <div className="text-center text-xs text-text-secondary py-4">Loading icons...</div>
            ) : filteredIcons.length === 0 ? (
              <div className="text-center text-xs text-text-secondary py-4">No matching icons found</div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => {
                      onSelect(icon.id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer hover:border-brand-red ${
                      selectedIconId === icon.id
                        ? "border-brand-red bg-brand-red/10"
                        : "border-border-theme bg-input-bg/50"
                    }`}
                    title={icon.name}
                  >
                    <img
                      src={icon.url}
                      alt={icon.name}
                      className="w-6 h-6 object-contain theme-icon-invert"
                    />
                    <span className="text-[10px] text-text-secondary truncate w-full text-center">
                      {icon.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
