import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Multimediary",
};

const LAST_UPDATED = "16 May 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      <Header />

      <article className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-10 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
          <div>
            <h1 className="text-5xl font-outfit font-black text-white uppercase tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-text-dim mt-1 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="space-y-10 text-text-dim leading-relaxed">
          <Section title="Acceptance of Terms">
            <p>
              By accessing or using Multimediary (the &ldquo;Service&rdquo;), you agree to be bound by these
              Terms &amp; Conditions. If you do not agree with any part of these terms, please do not use the
              Service.
            </p>
          </Section>

          <Section title="Description of Service">
            <p>
              Multimediary is a private physical media library management system that allows authorised
              administrators to catalogue, organise, and browse a collection of physical media titles
              (DVDs, Blu-rays, and similar formats). The public-facing interface provides read-only browsing
              of the catalogued library.
            </p>
          </Section>

          <Section title="Permitted Use">
            <p>You may use the public browsing features of Multimediary to:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-text-dim">
              <li>Browse the media catalogue</li>
              <li>Search for titles, genres, categories, actors, and directors</li>
              <li>View details about specific titles in the collection</li>
            </ul>
            <p className="mt-4">
              Administrator access is restricted to authorised individuals only. Attempting to gain
              unauthorised access to administrator functions is strictly prohibited.
            </p>
          </Section>

          <Section title="Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-text-dim">
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Use automated tools to scrape, index, or mass-download catalogue data without permission</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code from the Service</li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            <p>
              Movie metadata, posters, and related content displayed in the library may be sourced from
              The Movie Database (TMDb) and is subject to their respective copyright and licensing terms.
              This Service does not claim ownership of third-party metadata or imagery.
            </p>
            <p className="mt-3">
              The Multimediary application software itself is the intellectual property of its developer.
              All rights are reserved unless otherwise stated.
            </p>
          </Section>

          <Section title="Disclaimers">
            <p>
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without
              warranties of any kind, either express or implied. We do not warrant that the Service will be
              uninterrupted, error-free, or that any defects will be corrected.
            </p>
            <p className="mt-3">
              Library catalogue data is entered and maintained by administrators. We make no guarantee
              regarding the accuracy, completeness, or currency of the catalogue information displayed.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, the operators of Multimediary shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages arising from
              your use of, or inability to use, the Service.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>
              The Service may interact with third-party APIs (such as The Movie Database) to enrich catalogue
              data. These third-party services operate under their own terms and privacy policies, for which
              we are not responsible.
            </p>
          </Section>

          <Section title="Changes to These Terms">
            <p>
              We reserve the right to modify these Terms &amp; Conditions at any time. Changes will be
              reflected by updating the &ldquo;last updated&rdquo; date at the top of this page. Your
              continued use of the Service following any changes constitutes acceptance of the revised terms.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes
              arising from your use of the Service shall be subject to the exclusive jurisdiction of the
              courts in the jurisdiction of the Service operator.
            </p>
          </Section>

          <div className="border-t border-white/5 pt-8">
            <p className="text-sm">
              If you have questions about these terms, please refer to our{" "}
              <Link href="/privacy-policy" className="text-brand-secondary hover:underline">
                Privacy Policy
              </Link>{" "}
              or contact the system administrator.
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
