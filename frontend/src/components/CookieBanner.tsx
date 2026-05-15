"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronRight, Shield, BarChart2, Settings, Megaphone } from "lucide-react";
import Link from "next/link";
import { useCookieStore, type CookiePreferences } from "@/store/cookieStore";

/* ── Category metadata ─────────────────────────────────────── */
const CATEGORIES = [
  {
    key: "functional" as const,
    icon: Settings,
    label: "Functional",
    description:
      "Enable personalised features such as remembering your authentication state and UI preferences across sessions.",
    required: false,
  },
  {
    key: "performance" as const,
    icon: BarChart2,
    label: "Performance",
    description:
      "Collect anonymous usage data to help us understand how the app is used and where we can improve the experience.",
    required: false,
  },
  {
    key: "marketing" as const,
    icon: Megaphone,
    label: "Marketing",
    description:
      "Allow personalised recommendations and, if enabled in future, relevant promotional content.",
    required: false,
  },
];

/* ── Toggle switch ─────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary
        ${checked ? "bg-brand-secondary" : "bg-white/20"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

/* ── Preferences modal ─────────────────────────────────────── */
function PreferencesModal({ onClose }: { onClose: () => void }) {
  const { preferences, acceptAll, rejectAll, savePreferences } = useCookieStore();

  const [local, setLocal] = useState({
    functional: preferences?.functional ?? false,
    performance: preferences?.performance ?? false,
    marketing: preferences?.marketing ?? false,
  });

  const toggle = (key: keyof typeof local) =>
    setLocal((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-bg-elevated shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-secondary/15 flex items-center justify-center">
              <Cookie size={18} className="text-brand-secondary" />
            </div>
            <h2 className="font-outfit font-black text-white text-lg">Cookie Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-dim hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-text-dim text-sm leading-relaxed">
            Choose which cookies you allow. Strictly necessary cookies cannot be disabled as they are required for
            the site to function correctly.{" "}
            <Link href="/cookie-policy" onClick={onClose} className="text-brand-secondary hover:underline">
              Learn more
            </Link>
          </p>

          {/* Always-on row */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Shield size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-white font-bold text-sm">Strictly Necessary</span>
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider bg-brand-secondary/10 px-2 py-0.5 rounded-full">
                  Always On
                </span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                Essential for authentication and core site functionality. Cannot be disabled.
              </p>
            </div>
          </div>

          {/* Configurable rows */}
          {CATEGORIES.map(({ key, icon: Icon, label, description }) => (
            <div key={key} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} className="text-text-dim" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-white font-bold text-sm">{label}</span>
                  <Toggle checked={local[key]} onChange={(v) => toggle(key)} />
                </div>
                <p className="text-text-muted text-xs leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={rejectAll}
            className="flex-1 h-10 rounded-xl border border-white/10 text-text-dim hover:text-white hover:border-white/20 text-sm font-bold transition-colors"
          >
            Reject All
          </button>
          <button
            onClick={() => savePreferences(local)}
            className="flex-1 h-10 rounded-xl border border-brand-secondary/40 text-brand-secondary hover:bg-brand-secondary/10 text-sm font-bold transition-colors"
          >
            Save Preferences
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 h-10 rounded-xl bg-brand-secondary text-bg-deep font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Accept All
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main banner ───────────────────────────────────────────── */
export default function CookieBanner() {
  const { hasDecided, showPreferencesModal, acceptAll, rejectAll, openPreferences, closePreferences } =
    useCookieStore();

  // Prevent hydration mismatch — store reads localStorage on client only
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const showBanner = !hasDecided;

  return (
    <>
      {/* Bottom banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-[999] border-t border-white/8"
            style={{ background: "rgba(5, 7, 10, 0.97)", backdropFilter: "blur(16px)" }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* Icon + text */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie size={20} className="text-brand-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm mb-1">We use cookies</p>
                  <p className="text-text-dim text-xs leading-relaxed">
                    We use cookies to keep the site working and to understand how it is used. You can choose which
                    optional cookies to allow.{" "}
                    <Link href="/cookie-policy" className="text-brand-secondary hover:underline">
                      Cookie Policy
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={rejectAll}
                  className="h-9 px-5 rounded-xl border border-white/10 text-text-dim hover:text-white hover:border-white/20 text-xs font-bold transition-colors"
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={openPreferences}
                  className="h-9 px-5 rounded-xl border border-brand-secondary/40 text-brand-secondary hover:bg-brand-secondary/10 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  Manage Preferences
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={acceptAll}
                  className="h-9 px-5 rounded-xl bg-brand-secondary text-bg-deep font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences modal — accessible from banner AND footer link */}
      <AnimatePresence>
        {showPreferencesModal && <PreferencesModal onClose={closePreferences} />}
      </AnimatePresence>
    </>
  );
}
