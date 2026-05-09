import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className="hero hero--primary" style={{ padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <Heading as="h1">{siteConfig.title}</Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
            <Link className="button button--secondary button--lg" to="/docs/guide/introduction">
              Get Started
            </Link>
            <Link className="button button--outline button--secondary button--lg" to="/docs/api-reference/multimediary-api">
              API Reference
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
