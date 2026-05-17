import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/styles/theme.css";
import QueryProvider from "@/context/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Multimediary — Personal Movie Library",
    template: "%s | Multimediary",
  },
  description:
    "Browse a personal physical media library of DVDs and Blu-rays. Explore movies by genre, category, cast, and director.",
  keywords: ["movie library", "physical media", "DVD", "Blu-ray", "film catalogue", "personal collection"],
  authors: [{ name: "Hashan Athurugiriya" }],
  creator: "Hashan Athurugiriya",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Multimediary",
    title: "Multimediary — Personal Movie Library",
    description:
      "Browse a personal physical media library of DVDs and Blu-rays. Explore movies by genre, category, cast, and director.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Multimediary",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Multimediary — Personal Movie Library",
    description:
      "Browse a personal physical media library of DVDs and Blu-rays.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans selection:bg-brand-primary/30 selection:text-white">
        <QueryProvider>
          <TooltipProvider>
            {children}
            <CookieBanner />
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
