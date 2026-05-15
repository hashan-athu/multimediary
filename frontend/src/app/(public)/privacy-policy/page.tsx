import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Multimediary",
};

const LAST_UPDATED = "16 May 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <article className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-text-dim mt-1 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="space-y-10 text-text-dim leading-relaxed">
          <Section title="Overview">
            <p>
              Multimediary is a personal physical media library management system. This Privacy Policy explains
              what information is handled when you use the application. Because this is a personal tool rather
              than a commercial service, the amount of data involved is minimal.
            </p>
            <p className="mt-3">
              The public-facing pages of Multimediary are read-only. Browsing movies, genres, categories,
              and actors does not require any account and we do not collect personal data from visitors who
              simply browse the library.
            </p>
          </Section>

          <Section title="Information We Process">
            <h3 className="text-white font-bold mb-2">Public visitors</h3>
            <p>
              We do not collect, store, or process any personally identifiable information from users who browse
              the public library. No account creation or login is required. Standard web server logs (IP address,
              browser type, page visited, timestamp) may be recorded at the infrastructure level for security
              and diagnostic purposes; these are not used for tracking or profiling.
            </p>

            <h3 className="text-white font-bold mt-5 mb-2">Administrator accounts</h3>
            <p>
              Administrators who log in to manage the library provide an email address and password. These
              credentials are stored securely — passwords are hashed using industry-standard algorithms and
              are never stored in plain text. Upon successful login a JSON Web Token (JWT) is issued and stored
              as an HTTP cookie (<code className="text-brand-secondary text-xs">mm_token</code>) for the
              duration of the session.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use a small number of cookies and browser storage items, described in our{" "}
              <Link href="/cookie-policy" className="text-brand-secondary hover:underline">
                Cookie Policy
              </Link>
              . You can manage your cookie preferences at any time using the Cookie Settings option in the
              site footer.
            </p>
          </Section>

          <Section title="Data Sharing">
            <p>
              We do not sell, rent, or share your personal data with any third parties. Multimediary does not
              integrate advertising networks, social-media trackers, or commercial analytics platforms.
            </p>
            <p className="mt-3">
              Movie metadata may be fetched from The Movie Database (TMDb) API during import operations
              performed by administrators. TMDb's own privacy policy governs any data exchanged with their
              service.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>
              Administrator account data is retained for as long as the account is active. Session tokens expire
              automatically and are invalidated on logout. If you wish to have your administrator account
              removed, please contact the system owner directly.
            </p>
          </Section>

          <Section title="Security">
            <p>
              We implement reasonable technical safeguards including password hashing, JWT-based authentication,
              rate limiting on API endpoints, and CORS restrictions. No system can guarantee absolute security,
              but we take reasonable steps to protect the data we hold.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>
              If you are an administrator and would like to access, correct, or delete the personal data
              associated with your account, please contact the system owner. Public visitors have no personal
              data stored and therefore no data subject access requests are necessary.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              This policy may be updated occasionally. The &ldquo;last updated&rdquo; date at the top of this
              page will reflect any changes. Continued use of the application after a policy change constitutes
              acceptance of the revised terms.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For any privacy-related questions, please contact the administrator of this Multimediary
              installation directly.
            </p>
          </Section>
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
