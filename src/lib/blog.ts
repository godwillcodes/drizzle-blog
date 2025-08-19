import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type Article = {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
};

// Pure function to fetch published articles
export async function getPublishedArticles(): Promise<Article[]> {
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

  return result.map((a) => ({
    id: a.id ?? 0,
    title: a.title ?? "Untitled",
    slug: a.slug ?? "untitled",
    description: a.description ?? "",
    publishDate: a.publishDate ?? new Date().toISOString(),
    authorFirstName: a.authorFirstName ?? null,
    authorLastName: a.authorLastName ?? null,
  }));
}