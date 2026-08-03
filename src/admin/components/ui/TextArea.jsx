export default function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  error = "",
  helper = "",
  disabled = false,
  className = "",
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label} {required && <span className="text-brand-red">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-input-bg border ${
          error ? "border-brand-red" : "border-border-theme focus:border-brand-red/60"
        } rounded-xl text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition duration-200 resize-y disabled:opacity-50 font-sans`}
      />
      {error && <p className="text-xs text-brand-red font-medium">{error}</p>}
      {helper && !error && <p className="text-xs text-text-secondary">{helper}</p>}
    </div>
  );
}
