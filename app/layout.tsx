import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NarrativeWeb | Interactive Character Relationship Map",
  description: "Create, visualize, and manage complex character relationships for your web novels, webtoons, and stories.",
  keywords: ["character map", "storytelling tool", "writer tools", "relationship diagram", "narrative design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0f1115] text-slate-200 selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
