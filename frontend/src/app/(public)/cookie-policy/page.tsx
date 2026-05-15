"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieStore } from "@/store/cookieStore";

const LAST_UPDATED = "16 May 2026";

const COOKIE_TABLE = [
  {
    name: "mm_token",
    category: "Strictly Necessary",
    purpose: "Stores the administrator JWT session token used to authenticate API requests.",
    duration: "Session (cleared on logout)",
    type: "HTTP Cookie",
  },
  {
    name: "mm-cookie-consent",
    category: "Strictly Necessary",
    purpose: "Saves your cookie consent preferences so we do not ask again on return visits.",
    duration: "1 year",
    type: "localStorage",
  },
  {
    name: "mm-auth",
    category: "Functional",
    purpose: "Caches administrator profile data (name, role) to avoid re-fetching on every page load.",
    duration: "Session",
    type: "localStorage",
  },
];

export default function CookiePolicyPage() {
  const { openPreferences, preferences } = useCookieStore();

  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <article className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-accent rounded-full shadow-[0_0_10px_rgba(245,189,50,0.4)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-text-dim mt-1 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        {/* Update preferences CTA */}
        <div className="mb-10 p-5 rounded-2xl border border-brand-secondary/20 bg-brand-secondary/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie size={24} className="text-brand-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">Your current preferences</p>
            <p className="text-text-dim text-xs mt-0.5">
              {preferences
                ? `Functional: ${preferences.functional ? "On" : "Off"} · Performance: ${preferences.performance ? "On" : "Off"} · Marketing: ${preferences.marketing ? "On" : "Off"}`
                : "No preferences saved yet."}
            </p>
          </div>
          <button
            onClick={openPreferences}
            className="shrink-0 h-9 px-5 rounded-xl border border-brand-secondary/40 text-brand-secondary hover:bg-brand-secondary/10 text-xs font-bold transition-colors"
          >
            Update Preferences
          </button>
        </div>

        <div className="space-y-10 text-text-dim leading-relaxed">
          <Section title="What Are Cookies?">
            <p>
              Cookies are small text files placed on your device when you visit a website. They help sites
              remember information about your visit so the experience is more efficient and personalised.
              Multimediary also uses browser <strong className="text-white">localStorage</strong> — a similar
              mechanism that stores data locally on your device — for some preferences.
            </p>
          </Section>

          <Section title="How We Use Cookies">
            <p>
              Multimediary uses a minimal set of cookies and storage items. We do not use cookies for
              advertising or third-party tracking. The table below lists every cookie and storage item
              currently set by the application.
            </p>

            {/* Cookie table */}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03]">
                    {["Name", "Category", "Purpose", "Duration", "Type"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-white font-bold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COOKIE_TABLE.map((row) => (
                    <tr key={row.name} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-mono text-brand-secondary text-xs whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">{row.category}</td>
                      <td className="px-4 py-3 text-text-dim text-xs">{row.purpose}</td>
                      <td className="px-4 py-3 text-text-dim whitespace-nowrap text-xs">{row.duration}</td>
                      <td className="px-4 py-3 text-text-dim whitespace-nowrap text-xs">{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Cookie Categories">
            <div className="space-y-5 mt-2">
              <CategoryBlock
                label="Strictly Necessary"
                color="text-white"
                bg="bg-white/10"
              >
                These cookies are essential for the website to function. They enable core features such as
                administrator authentication and saving your cookie consent decision. You cannot opt out of
                strictly necessary cookies.
              </CategoryBlock>

              <CategoryBlock
                label="Functional"
                color="text-brand-secondary"
                bg="bg-brand-secondary/10"
              >
                Functional cookies allow the site to remember choices you have made (such as your
                administrator profile) to provide a more personalised experience. These are optional and
                can be disabled in your preferences.
              </CategoryBlock>

              <CategoryBlock
                label="Performance"
                color="text-accent"
                bg="bg-accent/10"
              >
                Performance cookies collect anonymous information about how the application is used —
                for example, which pages are visited most often. This data helps improve the experience
                over time. We do not currently deploy any performance cookies; this category is reserved
                for future use.
              </CategoryBlock>

              <CategoryBlock
                label="Marketing"
                color="text-brand-primary"
                bg="bg-brand-primary/10"
              >
                Marketing cookies would be used to deliver relevant promotions or recommendations.
                Multimediary does not currently use marketing cookies. This category exists for
                transparency about future possibilities.
              </CategoryBlock>
            </div>
          </Section>

          <Section title="Managing Your Preferences">
            <p>
              You can update your cookie preferences at any time by clicking{" "}
              <button onClick={openPreferences} className="text-brand-secondary hover:underline font-medium">
                Cookie Settings
              </button>{" "}
              in the site footer, or using the button at the top of this page.
            </p>
            <p className="mt-3">
              You can also manage cookies directly through your browser settings. Most browsers allow you
              to block or delete cookies entirely. Note that disabling strictly necessary cookies may prevent
              administrator login from functioning correctly. For guidance, refer to your browser&apos;s
              help documentation.
            </p>
          </Section>

          <Section title="Third-Party Cookies">
            <p>
              Multimediary does not load third-party scripts or allow third-party cookies. The only
              external service contacted is The Movie Database (TMDb) API, which is called server-side
              by administrators during content import — no cookies are set by TMDb on your device.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              If we change which cookies we use, this policy will be updated and the &ldquo;last
              updated&rdquo; date revised. For significant changes, we will present the consent banner
              again so you can review and update your preferences.
            </p>
          </Section>

          <div className="border-t border-white/5 pt-8">
            <p className="text-sm">
              Related:{" "}
              <Link href="/privacy-policy" className="text-brand-secondary hover:underline">
                Privacy Policy
              </Link>{" "}
              ·{" "}
              <Link href="/terms" className="text-brand-secondary hover:underline">
                Terms &amp; Conditions
              </Link>
            </p>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/5 pt-8">
      <h2 className="text-xl font-outfit font-black text-white uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </section>
  );
}

function CategoryBlock({
  label,
  color,
  bg,
  children,
}: {
  label: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
      <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 ${color} ${bg}`}>
        {label}
      </span>
      <p className="text-text-dim text-sm leading-relaxed">{children}</p>
    </div>
  );
}
