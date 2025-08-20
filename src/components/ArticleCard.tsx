import Link from "next/link";
import { Article } from "@/lib/blog";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
    href={`/blog/${article.slug}`}
    aria-labelledby={`article-${article.id}`}
    className="group relative flex flex-col rounded-xl border border-gray-600 bg-gray-900 p-6 transition hover:border-teal-500 hover:bg-gray-950 focus:outline-none  focus:ring-teal-400"
  >
    <h2
      id={`article-${article.id}`}
      className="mb-3 text-lg font-semibold text-white group-hover:text-teal-400 md:text-xl line-clamp-2"
    >
      {article.title ?? "Untitled"}
    </h2>
  
    <div className="mb-4 text-base text-gray-400">
      By{" "}
      <span className="font-medium text-teal-400">
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
    </div>
  
    <p className="flex-grow text-base leading-relaxed text-gray-300 line-clamp-3">
      {article.description || "No description available."}
    </p>
  
    <span
      aria-hidden="true"
      className="mt-6 inline-flex items-center text-sm font-medium text-teal-400 group-hover:text-teal-300"
    >
      Read more
      <svg
        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </Link>
  
    
  );
}