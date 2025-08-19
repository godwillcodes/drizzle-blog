import Link from "next/link";
import { Article } from "@/lib/single-blog";

interface Props {
  article: Article;
}

export default function ArticleContent({ article }: Props) {
  return (
    <main className="relative font-mono min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100 px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-8">
          {article.title}
        </h1>

        <p className="text-xl text-gray-400 mb-20">
          By <span className="font-semibold text-teal-300">{article.authorFirstName} {article.authorLastName}</span> •{" "}
          {new Date(article.publishDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <article className="prose space-y-6 prose-xl prose-invert prose-teal mx-auto text-left text-lg sm:text-justify leading-relaxed tracking-wide">
          <div className="space-y-8" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

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
