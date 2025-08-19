import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/blog";
import { notFound } from "next/navigation";

export default async function BlogPage() {
  let allArticles = [];

  try {
    allArticles = await getPublishedArticles();
    if (!allArticles.length) notFound();
  } catch (err) {
    console.error(err);
    return <p>Unable to load articles.</p>;
  }

  return (
    <main className="relative font-mono bg-black text-gray-900 overflow-x-hidden">
      <section className="relative max-w-7xl mx-auto py-24 px-6 lg:px-0">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-2">
            Insights & Stories
          </h1>
          <p className="text-xl text-gray-300">Discover the latest insights and stories from our community.</p>
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
