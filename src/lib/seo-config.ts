import type { Metadata } from "next";

// Base configuration for the application
export const SITE_CONFIG = {
  name: "Drizzle Blog",
  description: "A minimal blog platform built with Next.js 15, TypeScript, Drizzle ORM, and Tailwind CSS. Features article listing, detail pages, author relationships, and responsive UI.",
  url: "https://drizzle-blog-gules.vercel.app",
  ogImage: "/images/og-image.webp",
  twitterHandle: "@drizzleblog",
  keywords: [
    "blog",
    "nextjs",
    "typescript", 
    "drizzle",
    "postgresql",
    "tailwindcss",
    "articles",
    "modern web development",
  ] as string[],
} as const;

// Base metadata for all pages
export const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: "Drizzle Blog Team" }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

// Helper function to generate page-specific metadata
export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string,
  image?: string
): Metadata {
  const url = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;
  const pageDescription = description || SITE_CONFIG.description;
  const pageImage = image || SITE_CONFIG.ogImage;

  return {
    title,
    description: pageDescription,
    openGraph: {
      ...BASE_METADATA.openGraph,
      title,
      description: pageDescription,
      url,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...BASE_METADATA.twitter,
      title,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Home page specific metadata
export const HOME_METADATA: Metadata = {
  ...BASE_METADATA,
  title: "Simple Blog built with Next.js 15, TypeScript, and Drizzle ORM",
  description: "A clean, responsive blog platform built with Next.js 15, TypeScript, and Drizzle ORM. This application demonstrates modern web development best practices, featuring list and detail views of published articles authored by multiple contributors.",
  openGraph: {
    ...BASE_METADATA.openGraph,
    title: "Simple Blog built with Next.js 15, TypeScript, and Drizzle ORM",
    description: "A clean, responsive blog platform built with Next.js 15, TypeScript, and Drizzle ORM. This application demonstrates modern web development best practices, featuring list and detail views of published articles authored by multiple contributors.",
  },
  twitter: {
    ...BASE_METADATA.twitter,
    title: "Simple Blog built with Next.js 15, TypeScript, and Drizzle ORM",
    description: "A clean, responsive blog platform built with Next.js 15, TypeScript, and Drizzle ORM. This application demonstrates modern web development best practices, featuring list and detail views of published articles authored by multiple contributors.",
  },
};

// Blog listing page specific metadata
export const BLOG_LIST_METADATA: Metadata = {
  ...BASE_METADATA,
  title: "Published Articles",
  description: "Browse all published articles on our blog. Discover insights, stories, and articles from our community of writers.",
  openGraph: {
    ...BASE_METADATA.openGraph,
    title: "Published Articles",
    description: "Browse all published articles on our blog. Discover insights, stories, and articles from our community of writers.",
    url: `${SITE_CONFIG.url}/blog`,
  },
  twitter: {
    ...BASE_METADATA.twitter,
    title: "Published Articles",
    description: "Browse all published articles on our blog. Discover insights, stories, and articles from our community of writers.",
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};
