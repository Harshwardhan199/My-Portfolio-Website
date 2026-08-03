import { useState, useEffect } from "react";
import StatCard from "../components/ui/StatCard";
import SectionHeader from "../components/ui/SectionHeader";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";
import { useIconLibrary } from "../hooks/useIconLibrary";
import { seedInitialData, isFirestoreInitialized } from "../services/seedService";
import { publishAll } from "../services/publishService";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardHome({ onNavigate }) {
  const { user } = useAuth();
  const { data: projects } = useFirestoreCollection("draft_projects");
  const { data: skills } = useFirestoreCollection("draft_skills");
  const { data: experience } = useFirestoreCollection("draft_experience");
  const { icons } = useIconLibrary();
  const { data: statusDoc } = useFirestoreDoc("system", "status");

  const [initialized, setInitialized] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  const [showPublishAllConfirm, setShowPublishAllConfirm] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  useEffect(() => {
    async function checkInitStatus() {
      const isInit = await isFirestoreInitialized();
      setInitialized(isInit);
    }
    checkInitStatus();
  }, [statusDoc]);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      await seedInitialData(user);
      setInitialized(true);
      setShowSeedConfirm(false);
    } catch (err) {
      console.error("Error seeding initial data:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePublishAll = async () => {
    try {
      setIsPublishingAll(true);
      await publishAll(user);
      setShowPublishAllConfirm(false);
    } catch (err) {
      console.error("Error publishing all:", err);
    } finally {
      setIsPublishingAll(false);
    }
  };

  const totalSkillItems = skills.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

  const formatTimestamp = (ts) => {
    if (!ts) return "Never";
    if (ts.toDate) return ts.toDate().toLocaleString();
    if (typeof ts === "string") return new Date(ts).toLocaleString();
    return "Recent";
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Operational Dashboard"
        subtitle="Overview of your portfolio content, Firestore status, and publishing actions."
      />

      {/* Seeding Alert Header if Firestore is Uninitialized */}
      {!initialized && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-amber-500 flex items-center gap-2">
              ⚠️ Firestore Uninitialized
            </h3>
            <p className="text-xs text-text-secondary">
              No portfolio data detected in Firestore. Seed the initial dataset from project files to start editing.
            </p>
          </div>
          <button
            onClick={() => setShowSeedConfirm(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            Seed Initial Data
          </button>
        </div>
      )}

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={projects.length}
          subtitle={`${projects.filter((p) => p.featured).length} Featured`}
          icon="🚀"
          action={
            <button
              onClick={() => onNavigate("projects")}
              className="text-brand-red font-semibold hover:underline cursor-pointer"
            >
              Manage
            </button>
          }
        />

        <StatCard
          title="Skills & Categories"
          value={`${totalSkillItems} / ${skills.length}`}
          subtitle={`${skills.length} Categories`}
          icon="🛠️"
          action={
            <button
              onClick={() => onNavigate("skills")}
              className="text-brand-red font-semibold hover:underline cursor-pointer"
            >
              Manage
            </button>
          }
        />

        <StatCard
          title="Experience Entries"
          value={experience.length}
          subtitle="Work History"
          icon="💼"
          action={
            <button
              onClick={() => onNavigate("experience")}
              className="text-brand-red font-semibold hover:underline cursor-pointer"
            >
              Manage
            </button>
          }
        />

        <StatCard
          title="Shared Icons"
          value={icons.length}
          subtitle="Centralized Library"
          icon="🎨"
          action={
            <button
              onClick={() => onNavigate("icons")}
              className="text-brand-red font-semibold hover:underline cursor-pointer"
            >
              Manage
            </button>
          }
        />
      </div>

      {/* Operational System Metadata */}
      <div className="bg-card-dark border border-border-theme p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-text-primary border-b border-border-theme pb-3">
          System & Publishing Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Initialization State
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  initialized ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              <span className="text-sm font-semibold text-text-primary">
                {initialized ? "Firestore Initialized" : "Pending Initial Seed"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Last Published Time
            </span>
            <span className="text-sm font-mono text-text-primary">
              {formatTimestamp(statusDoc?.lastPublishedAt)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Last Draft Update
            </span>
            <span className="text-sm font-mono text-text-primary">
              {formatTimestamp(statusDoc?.lastDraftUpdatedAt)}
            </span>
          </div>
        </div>

        {/* Quick Operational Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border-theme">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-input-bg border border-border-theme hover:border-brand-red/50 text-text-primary text-xs font-semibold rounded-xl transition"
          >
            Open Live Portfolio (/)
          </a>

          <a
            href="/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-semibold rounded-xl transition"
          >
            Open Preview Mode (/preview)
          </a>

          <button
            onClick={() => setShowPublishAllConfirm(true)}
            className="px-5 py-2 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer shadow-md shadow-brand-red/20"
          >
            Publish All Sections
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showSeedConfirm}
        title="Seed Initial Portfolio Data?"
        message="This will populate your Firestore draft collections with default portfolio data and automatically publish it to your live collections."
        confirmText="Seed & Publish"
        isLoading={isSeeding}
        onConfirm={handleSeed}
        onCancel={() => setShowSeedConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showPublishAllConfirm}
        title="Publish All Sections?"
        message="This will copy all current draft data across your entire portfolio into live published collections."
        confirmText="Publish All Live"
        isLoading={isPublishingAll}
        onConfirm={handlePublishAll}
        onCancel={() => setShowPublishAllConfirm(false)}
      />
    </div>
  );
}
