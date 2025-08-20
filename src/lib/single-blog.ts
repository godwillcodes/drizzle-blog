import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Article type returned to the application layer
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

/**
 * Fetch a single published article by its slug.
 * Returns null if not found or if an error occurs.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Query DB for a published article matching the slug
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
      .limit(1) // Ensure only one record is returned
      .execute();

    const article = result?.[0];
    if (!article) return null; // No article found

    // Validate required fields before returning
    if (!article.id || !article.title || !article.content || !article.publishDate) {
      throw new Error(`Invalid article record for slug "${slug}": ${JSON.stringify(article)}`);
    }

    // Normalize optional values and return a consistent Article object
    return {
      id: article.id,
      title: article.title,
      description: article.description ?? "",
      content: article.content,
      publishDate: new Date(article.publishDate).toISOString(),
      authorFirstName: article.authorFirstName ?? null,
      authorLastName: article.authorLastName ?? null,
      authorEmail: article.authorEmail ?? null,
    };
  } catch (err) {
    // Catch DB errors, schema mismatches, or validation errors
    console.error(`Error fetching article by slug "${slug}":`, err);
    return null;
  }
}
