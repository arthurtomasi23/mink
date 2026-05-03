import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { PostHogProvider } from "@/components/PostHogProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mink.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mink — Discover tattoos. Save the ones you love.",
    template: "%s · Mink",
  },
  description:
    "Mink is a tattoo discovery app. Browse a curated visual feed, search by style or reference photo, save pieces to collections, and connect with artists.",
  keywords: [
    "tattoo",
    "tattoo app",
    "tattoo discovery",
    "tattoo inspiration",
    "tattoo artists",
    "find a tattoo artist",
    "tattoo search",
    "image search tattoo",
    "tattoo collections",
    "Mink",
  ],
  authors: [{ name: "Mink" }],
  creator: "Mink",
  publisher: "Mink",
  applicationName: "Mink",
  category: "lifestyle",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Mink — Discover tattoos. Save the ones you love.",
    description:
      "A discovery-first tattoo app. Search by style or reference photo, save to collections, follow artists.",
    url: SITE_URL,
    siteName: "Mink",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mink — Discover tattoos.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mink — Discover tattoos. Save the ones you love.",
    description:
      "Discovery-first tattoo app. Search by style or reference photo, save to collections, follow artists.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-canvas text-text-primary antialiased">
        <PostHogProvider />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
