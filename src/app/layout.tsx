import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GNI Basel — Tonight's quiet-lux routes",
  description:
    "Curated GNI Picks for Basel week: collector previews, Wynwood crawls, and concierge-backed routes.",
  metadataBase: new URL("https://gni-basel.local"),
  openGraph: {
    title: "GNI Basel",
    description: "Concierge-backed Basel picks, routes, and tonight planning.",
    url: "https://gni-basel.local",
    siteName: "GNI Basel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GNI Basel — Tonight",
    description: "Quiet-lux picks for Basel week with concierge on standby.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
