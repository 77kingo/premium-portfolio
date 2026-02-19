import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-vercel-domain.vercel.app"), // ← CHANGE THIS

  title: {
    default: "Saurav Singh | Full Stack Developer",
    template: "%s | Saurav Singh",
  },

  description:
    "Saurav Singh - Full Stack Developer building scalable, modern, and production-ready web applications.",

  openGraph: {
    title: "Saurav Singh Portfolio",
    description:
      "Full Stack Developer Portfolio with modern web projects and experience.",
    url: "https://your-vercel-domain.vercel.app",
    siteName: "Saurav Singh Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Saurav Singh Portfolio",
    description:
      "Modern Full Stack Developer Portfolio",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
