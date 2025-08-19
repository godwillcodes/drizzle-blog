import Link from "next/link";
import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const revalidate = 3600; // Refresh hourly in production for stale-while-revalidate pattern

export default async function BlogPage() {
  const allArticles = await db
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

  return (
    <main className="relative bg-black font-sans text-gray-900 overflow-x-hidden">


      <section className="relative max-w-7xl mx-auto py-24">
        {/* Captivating Section Title */}
        <h1 className="text-4xl sm:text-5xl text-center font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-2">

          Insights & Stories
        </h1>
        <p className="text-2xl text-center  text-gray-400">
          Discover the latest insights and stories from our community.
        </p>

        {/* Responsive Grid for Articles */}
        <div className="grid grid-cols-1 pt-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-16">
          {/* Example Article Card */}
          {allArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              aria-label={`Read more about ${article.title}`}
              className="group relative flex flex-col rounded-2xl p-8 
             bg-gray-900 backdrop-blur-xl border border-gray-700/50 
             shadow-lg hover:shadow-[0_8px_32px_rgba(45,212,191,0.25)] 
             transition-all duration-500 ease-in-out cursor-pointer"
            >
              {/* Title */}
              <h2
                className="text-xl md:text-2xl font-semibold mb-4 
               text-gray-100 group-hover:text-teal-400 
               transition-colors truncate"
              >
                {article.title}
              </h2>

              {/* Author & Date */}
              <p
                className="text-sm text-gray-400 mb-6 tracking-wide font-medium 
               select-none"
              >
                By{" "}
                <span className="text-teal-400">
                  {article.authorFirstName} {article.authorLastName}
                </span>{" "}
                •{" "}
                {new Date(article.publishDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed line-clamp-4 flex-grow">
                {article.description}
              </p>

              {/* CTA */}
              <span
                className="mt-8 inline-block self-start text-same md:text-base font-semibold 
               text-teal-400 group-hover:text-teal-300 
               transition-colors select-none"
              >
                Read More →
              </span>

              {/* Glow border on hover */}
              <div
                className="absolute inset-0 rounded-2xl border border-transparent 
               group-hover:border-teal-500/40 transition-colors"
              />
            </Link>

          ))}
        </div>
      </section>



    </main>
  );
}
