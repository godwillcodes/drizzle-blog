import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";

interface ArticleProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = params;

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
    .where(eq(articles.slug, slug))
    .where(eq(articles.isPublished, true))
    .limit(1)
    .execute(); // <-- use execute() in node-postgres

  const article = result[0];

  if (!article) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        By {article.authorFirstName} {article.authorLastName} |{" "}
        {new Date(article.publishDate).toLocaleDateString()}
      </p>
      <article className="prose prose-lg">
        <p>{article.content}</p>
      </article>
    </main>
  );
}
