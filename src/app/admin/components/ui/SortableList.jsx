export default function SortableList({
  items = [],
  onReorder,
  renderItem,
  className = "",
}) {
  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onReorder(updated);
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {items.map((item, idx) => (
        <div key={item.id || idx} className="flex items-center gap-3 w-full">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => moveItem(idx, -1)}
              className="p-1 rounded bg-input-bg border border-border-theme hover:border-brand-red text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:border-border-theme cursor-pointer"
              title="Move up"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              disabled={idx === items.length - 1}
              onClick={() => moveItem(idx, 1)}
              className="p-1 rounded bg-input-bg border border-border-theme hover:border-brand-red text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:border-border-theme cursor-pointer"
              title="Move down"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-w-0">{renderItem(item, idx)}</div>
        </div>
      ))}
    </div>
  );
}
