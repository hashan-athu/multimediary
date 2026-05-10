import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/styles/theme.css";
import QueryProvider from "@/context/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multimediary | Cinematic Media Library",
  description: "Browse and manage your physical media collection with style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-deep text-text-vibrant selection:bg-brand-primary/30 selection:text-white">
        <QueryProvider>
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
