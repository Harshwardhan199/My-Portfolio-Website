export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  action,
  className = "",
}) {
  return (
    <div
      className={`bg-card-dark border border-border-theme p-5 rounded-2xl shadow-sm hover:border-brand-red/30 transition duration-300 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {title}
          </span>
          <div className="text-2xl font-bold text-text-primary mt-1 font-mono">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-black/40 border border-border-theme text-text-primary">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || action) && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-theme text-xs text-text-secondary">
          <span>{subtitle}</span>
          {action}
        </div>
      )}
    </div>
  );
}
