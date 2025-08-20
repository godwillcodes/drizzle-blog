import type { Metadata, Viewport } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Drizzle Blog - Simple Blog Application",
  description:
    "A minimal blog platform built with Next.js 15, TypeScript, Drizzle ORM, and Tailwind CSS. Features article listing, detail pages, author relationships, and responsive UI.",
  keywords: [
    "blog",
    "nextjs",
    "typescript",
    "drizzle",
    "postgresql",
    "tailwindcss",
    "articles",
    "modern web development",
  ],
  authors: [{ name: "Drizzle Blog Team" }],
  creator: "Drizzle Blog",
  publisher: "Drizzle Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://drizzle-blog-gules.vercel.app"),
  alternates: {
    canonical: "https://drizzle-blog-gules.vercel.app/",
  },
  openGraph: {
    title: "Drizzle Blog - Simple Blog Application",
    description:
      "A minimal blog platform built with Next.js 15, TypeScript, Drizzle ORM, and Tailwind CSS. Features article listing, detail pages, author relationships, and responsive UI.",
    url: "https://drizzle-blog-gules.vercel.app",
    siteName: "Drizzle Blog",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Drizzle Blog - Simple Blog Application",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drizzle Blog - Simple Blog Application",
    description:
      "A minimal blog platform built with Next.js 15, TypeScript, Drizzle ORM, and Tailwind CSS.",
    images: ["/images/og-image.webp"],
    creator: "@drizzleblog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
