import Link from "next/link";
import { Article } from "@/lib/blog";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      aria-labelledby={`article-${article.id}`}
      className="group relative flex flex-col rounded-2xl p-4 lg:p-6 bg-gray-900 backdrop-blur-xl border border-gray-700/50 shadow-lg hover:shadow-[0_8px_32px_rgba(45,212,191,0.25)] transition-all duration-500 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      <h2 id={`article-${article.id}`} className="text-lg md:text-xl font-semibold mb-4 text-gray-100 group-hover:text-teal-400 transition-colors truncate">
        {article.title ?? "Untitled"}
      </h2>
      <p className="text-base text-gray-300 mb-6 tracking-wide font-medium select-none">
        By <span className="text-teal-400">{article.authorFirstName ?? "Unknown"} {article.authorLastName ?? ""}</span> •{" "}
        <time dateTime={article.publishDate} aria-label={`Published on ${isNaN(Date.parse(article.publishDate)) ? "Unknown date" : new Date(article.publishDate).toDateString()}`}>
          {isNaN(Date.parse(article.publishDate)) ? "Unknown date" : new Date(article.publishDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </time>
      </p>
      <p className="text-gray-200 leading-relaxed line-clamp-4 flex-grow">{article.description || "No description available."}</p>
      <span aria-hidden="true" className="mt-8 inline-block self-start text-sm md:text-base font-semibold text-teal-400 group-hover:text-teal-300 transition-colors select-none">
        Read More →
      </span>
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-teal-500/40 transition-colors pointer-events-none" />
    </Link>
  );
}