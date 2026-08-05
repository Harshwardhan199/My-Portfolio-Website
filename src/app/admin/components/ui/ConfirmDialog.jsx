import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card-dark border border-border-theme p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-5"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-input-bg border border-border-theme hover:bg-border-theme/40 text-text-primary transition cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2 text-sm font-semibold rounded-xl text-white transition cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20"
                  : "bg-brand-red hover:opacity-90 shadow-lg shadow-brand-red/20"
              }`}
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
