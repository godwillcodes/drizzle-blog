import Link from "next/link";
import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

// Cache revalidation interval in seconds (1 hour)
export const revalidate = 3600;

// Define Article type for type safety and clarity
type Article = {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
};

// Generate SEO metadata for the blog page
export async function generateMetadata() {
  try {
    const metadataBase = new URL("https://mysite.com"); // Production domain

    return {
      metadataBase,
      title: "Godwill's Simple Blog | MySite",
      description: "Discover the latest insights and stories from our community.",
      openGraph: {
        title: "Godwill's Simple Blog",
        description: "Discover the latest insights and stories from our community.",
        url: "/blog",
        type: "website",
        siteName: "MySite",
        images: [
          {
            url: "/og-default.png", // Path relative to metadataBase
            width: 1200,
            height: 630,
            alt: "Godwill's Simple Blog",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@YourTwitterHandle",
        creator: "@YourTwitterHandle",
      },
    };
  } catch (err) {
    console.error("Metadata generation error:", err);
    return {
      title: "Blog | Error",
      description: "Unable to load blog metadata.",
    };
  }
}

// ArticleCard component to render individual article summary
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      aria-labelledby={`article-${article.id}`}
      className="group relative flex flex-col rounded-2xl p-4 lg:p-6 
        bg-gray-900 backdrop-blur-xl border border-gray-700/50 
        shadow-lg hover:shadow-[0_8px_32px_rgba(45,212,191,0.25)] 
        transition-all duration-500 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      <h2
        id={`article-${article.id}`}
        className="text-lg md:text-xl font-semibold mb-4 
          text-gray-100 group-hover:text-teal-400 
          transition-colors truncate"
      >
        {article.title ?? "Untitled"}
      </h2>

      <p
        className="text-base text-gray-300 mb-6 tracking-wide font-medium 
          select-none"
      >
        By{" "}
        <span className="text-teal-400">
          {article.authorFirstName ?? "Unknown"} {article.authorLastName ?? ""}
        </span>{" "}
        •{" "}
        <time
          dateTime={article.publishDate}
          aria-label={`Published on ${
            isNaN(Date.parse(article.publishDate))
              ? "Unknown date"
              : new Date(article.publishDate).toDateString()
          }`}
        >
          {isNaN(Date.parse(article.publishDate))
            ? "Unknown date"
            : new Date(article.publishDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </time>
      </p>

      <p className="text-gray-200 leading-relaxed line-clamp-4 flex-grow">
        {article.description || "No description available."}
      </p>

      <span
        aria-hidden="true"
        className="mt-8 inline-block self-start text-sm md:text-base font-semibold 
          text-teal-400 group-hover:text-teal-300 
          transition-colors select-none"
      >
        Read More →
      </span>

      <div
        className="absolute inset-0 rounded-2xl border border-transparent 
          group-hover:border-teal-500/40 transition-colors pointer-events-none"
      />
    </Link>
  );
}

// BlogPage component to fetch and display published articles
export default async function BlogPage() {
  let allArticles: Article[] = [];

  try {
    // Query published articles with author data, ordered by publish date descending
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        description: articles.description,
        publishDate: articles.publishDate,
        authorFirstName: authors.firstName,
        authorLastName: authors.lastName,
      })
      .from(articles)
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishDate));

    if (!result || result.length === 0) {
      notFound();
    }

    // Map database results to Article type with default fallbacks
    allArticles = result.map((a) => ({
      id: a.id ?? 0,
      title: a.title ?? "Untitled",
      slug: a.slug ?? "untitled",
      description: a.description ?? "",
      publishDate: a.publishDate ?? new Date().toISOString(),
      authorFirstName: a.authorFirstName ?? null,
      authorLastName: a.authorLastName ?? null,
    }));
  } catch (err) {
    console.error("Database fetch error:", err);
    return (
      <main className="relative font-mono bg-black text-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-400 font-semibold">
          Unable to load articles at this time. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="relative font-mono bg-black text-gray-900 overflow-x-hidden">
      <section className="relative max-w-7xl mx-auto py-24 px-6 lg:px-0">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-2">
            Insights & Stories
          </h1>
          <p className="text-xl text-gray-300">
            Discover the latest insights and stories from our community.
          </p>
        </header>

        <div className="grid grid-cols-1 pt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}