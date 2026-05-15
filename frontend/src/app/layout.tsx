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

export const metadata: Metadata = {
  title: "Multimediary",
  description: "Physical media library management system.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
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
