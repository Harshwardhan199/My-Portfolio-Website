import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { publishSection } from "../../services/publishService";
import { useAuth } from "../../../hooks/useAuth";

export default function SectionHeader({
  title,
  subtitle,
  sectionKey,
  onPublishSuccess,
  children,
}) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await publishSection(sectionKey, user);
      setShowConfirm(false);
      if (onPublishSuccess) onPublishSuccess();
    } catch (err) {
      console.error(`Error publishing ${sectionKey}:`, err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-theme pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {children}

          {sectionKey && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer shadow-md shadow-brand-red/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Publish Section
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title={`Publish ${title}?`}
        message={`This will overwrite the live published ${title} section with your current draft data.`}
        confirmText="Publish Live"
        isLoading={isPublishing}
        onConfirm={handlePublish}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
