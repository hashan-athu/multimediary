import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

const features = [
  {
    icon: "🎬",
    title: "Movie Catalogue",
    desc: "Track titles by genre, cast, director, category, year, quality, and physical disk location.",
  },
  {
    icon: "💿",
    title: "Physical Inventory",
    desc: "Map every movie to the HDD, DVD, or Blu-ray disc it lives on. Browse by disk or format.",
  },
  {
    icon: "🔍",
    title: "TMDb Auto-Import",
    desc: "Import full metadata — poster, synopsis, cast, genres — from The Movie Database in two clicks.",
  },
  {
    icon: "🔐",
    title: "Role-Based Admin",
    desc: "Four-tier access control: super_admin, admin, editor, and analyst. Single-session JWT enforcement.",
  },
  {
    icon: "🌐",
    title: "Public Browser",
    desc: "A cinematic dark-themed site for browsing the library. No login required for visitors.",
  },
  {
    icon: "📡",
    title: "REST API",
    desc: "Fully documented public and admin JSON APIs with search, sorting, and pagination built in.",
  },
];

const stack = [
  { label: "Backend", value: "Rails 8.1" },
  { label: "Database", value: "PostgreSQL 17" },
  { label: "Frontend", value: "Next.js 16" },
  { label: "Auth", value: "Devise JWT" },
  { label: "Search", value: "Ransack" },
  { label: "Proxy", value: "Caddy 2" },
  { label: "Deploy", value: "Docker + GHCR" },
  { label: "Docs", value: "Docusaurus 3" },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      {/* Hero */}
      <div className="mm-hero">
        <div className="mm-hero__eyebrow">Developer Documentation</div>
        <h1 className="mm-hero__title">
          MULTI<span>MEDIARY</span>
        </h1>
        <p className="mm-hero__subtitle">{siteConfig.tagline}</p>
        <div className="mm-hero__ctas">
          <Link className="mm-btn-primary" to="/docs/getting-started/introduction">
            Get Started →
          </Link>
          <Link className="mm-btn-secondary" to="/docs/api-reference/multimediary-api">
            API Reference
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mm-features">
        <div className="mm-features__header">
          <p className="mm-features__label">What's inside</p>
          <p className="mm-features__title">Everything in one library</p>
        </div>
        <div className="mm-features__grid">
          {features.map((f) => (
            <div key={f.title} className="mm-card">
              <span className="mm-card__icon">{f.icon}</span>
              <p className="mm-card__title">{f.title}</p>
              <p className="mm-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stack pills */}
      <div className="mm-stack">
        <p className="mm-features__label">Built with</p>
        <div className="mm-stack__pills">
          {stack.map((s) => (
            <span key={s.label} className="mm-stack__pill">
              <b>{s.label}</b> {s.value}
            </span>
          ))}
        </div>
      </div>
    </Layout>
  );
}
