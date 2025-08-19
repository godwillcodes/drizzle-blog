import { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import Link from "next/link";

interface ArticleProps {
  params: {
    slug: string;
  };
}

// Generate SEO metadata for the article page using the slug param
export async function generateMetadata(props: ArticleProps): Promise<Metadata> {
  const params = await props.params; // Await dynamic route params
  const { slug } = params;

  // Fetch article title and description for metadata
  const article = await db
    .select({ title: articles.title, description: articles.description })
    .from(articles)
    .where(
      and(
        eq(articles.slug, slug),
        eq(articles.isPublished, true) // Only published articles
      )
    )
    .limit(1)
    .execute()
    .then(res => res[0]);

  if (!article) return { title: "Article Not Found" };

  // Return metadata for SEO and social sharing
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
    },
    twitter: {
      title: article.title,
      description: article.description,
    },
  };
}

// Main ArticlePage component: fetches and renders an article by slug
export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = await params; // Await route params destructure

  let article;
  try {
    // Fetch article data and author info by slug and published status
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        description: articles.description,
        content: articles.content,
        publishDate: articles.publishDate,
        authorFirstName: authors.firstName,
        authorLastName: authors.lastName,
        authorEmail: authors.email,
      })
      .from(articles)
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.slug, slug),
          eq(articles.isPublished, true)
        )
      )
      .limit(1)
      .execute();

    article = result[0];
  } catch (err) {
    console.error("Database fetch error:", err);
    notFound(); // Show 404 if fetching fails
  }

  if (!article) notFound(); // Show 404 if no article found

  return (
    <main className="relative font-mono min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100 px-6 py-32 overflow-hidden">
      {/* Decorative floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Article title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-8">
          {article.title}
        </h1>

        {/* Author and publication date */}
        <p className="text-xl text-gray-400 mb-20">
          By <span className="font-semibold text-teal-300">{article.authorFirstName} {article.authorLastName}</span> •{" "}
          {new Date(article.publishDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* Article content rendered as HTML */}
        <article className="prose space-y-6 prose-xl prose-invert prose-teal mx-auto text-left text-lg sm:text-justify leading-relaxed tracking-wide">
          <div className="space-y-8" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Link back to blog overview */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center px-6 py-3 rounded-full border border-teal-400/30 bg-white/5 backdrop-blur-md text-teal-300 font-semibold hover:bg-teal-400/20 hover:text-teal-200 transition-all duration-300 shadow-lg shadow-teal-500/10"
          >
            <svg
              className="w-5 h-5 mr-3 stroke-current group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    </main>
  );
}