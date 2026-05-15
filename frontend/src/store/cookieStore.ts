import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CookiePreferences {
  necessary: true;
  functional: boolean;
  performance: boolean;
  marketing: boolean;
}

interface CookieStore {
  preferences: CookiePreferences | null;
  hasDecided: boolean;
  showPreferencesModal: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: Pick<CookiePreferences, "functional" | "performance" | "marketing">) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

export const useCookieStore = create<CookieStore>()(
  persist(
    (set) => ({
      preferences: null,
      hasDecided: false,
      showPreferencesModal: false,

      acceptAll: () =>
        set({
          preferences: { necessary: true, functional: true, performance: true, marketing: true },
          hasDecided: true,
          showPreferencesModal: false,
        }),

      rejectAll: () =>
        set({
          preferences: { necessary: true, functional: false, performance: false, marketing: false },
          hasDecided: true,
          showPreferencesModal: false,
        }),

      savePreferences: (prefs) =>
        set({
          preferences: { necessary: true, ...prefs },
          hasDecided: true,
          showPreferencesModal: false,
        }),

      openPreferences: () => set({ showPreferencesModal: true }),
      closePreferences: () => set({ showPreferencesModal: false }),
    }),
    {
      name: "mm-cookie-consent",
      // Only persist the decision, not transient UI state
      partialize: (state) => ({
        preferences: state.preferences,
        hasDecided: state.hasDecided,
      }),
    }
  )
);
