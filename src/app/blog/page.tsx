import ArticleCard from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/blog";
import Link from "next/link";
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
    <main className="relative font-sans bg-black overflow-x-hidden">
      <section className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-0">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="div">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-5">
              Published Articles
            </h1>
            <p className="max-w-lg text-base lg:text-xl text-white">
              Display all published articles as cards. Click on the card to view the article.
            </p>
          </div>
          <div className="div">
          <Link
            href="/"
            className="group inline-flex items-center px-6 py-3 rounded-full border border-teal-400 bg-white/5 backdrop-blur-md text-teal-300 font-semibold hover:bg-teal-400/20 hover:text-teal-200 transition-all duration-300 shadow-lg shadow-teal-500/10"
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
            Go Back to Home
          </Link>
          </div>
        </div>



        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-20">
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
