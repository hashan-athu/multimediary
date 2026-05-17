import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Multimediary",
  tagline: "Developer documentation — Rails API, Next.js frontend, and deployment guides",
  favicon: "img/favicon.png",
  url: process.env.DOCS_SITE_URL || "http://localhost",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",

  future: { v4: true },

  markdown: {
    hooks: { onBrokenMarkdownLinks: "warn" },
  },

  i18n: { defaultLocale: "en", locales: ["en"] },

  // Force dark mode — Multimediary is dark-only
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },

    // Open Graph / social card
    image: "img/logo.svg",

    navbar: {
      logo: {
        alt: "Multimediary",
        src: "img/logo.svg",
        style: { filter: "brightness(0) invert(1)" }, // white on dark bg
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "gettingStartedSidebar",
          position: "left",
          label: "Getting Started",
        },
        {
          type: "docSidebar",
          sidebarId: "backendSidebar",
          position: "left",
          label: "Backend",
        },
        {
          type: "docSidebar",
          sidebarId: "frontendSidebar",
          position: "left",
          label: "Frontend",
        },
        {
          type: "docSidebar",
          sidebarId: "apiSidebar",
          position: "left",
          label: "API Reference",
        },
        {
          href: "https://github.com/hashan-athu/multimediary",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction",    to: "/docs/getting-started/introduction" },
            { label: "Installation",    to: "/docs/getting-started/installation" },
            { label: "API Reference",   to: "/docs/api-reference/multimediary-api" },
          ],
        },
        {
          title: "Backend",
          items: [
            { label: "Architecture",       to: "/docs/backend/architecture" },
            { label: "Authentication",     to: "/docs/backend/authentication" },
            { label: "Data Model",         to: "/docs/backend/data-model" },
            { label: "TMDb Integration",   to: "/docs/backend/tmdb-integration" },
          ],
        },
        {
          title: "Frontend",
          items: [
            { label: "Overview",     to: "/docs/frontend/overview" },
            { label: "Admin Panel",  to: "/docs/frontend/admin-panel" },
            { label: "Public Site",  to: "/docs/frontend/public-site" },
          ],
        },
        {
          title: "Operations",
          items: [
            { label: "Deployment",          to: "/docs/getting-started/deployment" },
            { label: "Environment Vars",    to: "/docs/getting-started/environment" },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Multimediary — Built with Docusaurus`,
    },

    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["ruby", "bash", "json", "yaml", "typescript", "docker"],
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          multimediary: {
            specPath: "api/openapi.yaml",
            outputDir: "docs/api-reference",
            sidebarOptions: { groupPathsBy: "tag" },
          },
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],
};

export default config;
