import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type Article = {
  id: number;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
  authorEmail?: string | null;
};

export async function getArticleBySlug(slug: string): Promise<Article | null> {
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
    .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
    .limit(1)
    .execute();

  return result?.[0] ?? null;
}
