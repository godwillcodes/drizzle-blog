import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Article type returned by this query
export type Article = {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
};

/**
 * Fetch all published articles from the database.
 * Returns an array of Article objects, or an empty array if an error occurs.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    // Query DB for all published articles with author info
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
      .leftJoin(authors, eq(articles.authorId, authors.id)) // optional author info
      .where(eq(articles.isPublished, true)) // only published articles
      .orderBy(desc(articles.publishDate)); // newest first

    // Validate and normalize results before returning
    return result.map((a) => {
      if (!a.id || !a.title || !a.slug || !a.publishDate) {
        // Critical fields missing = data corruption or schema mismatch
        throw new Error(`Invalid article record: ${JSON.stringify(a)}`);
      }
      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        description: a.description ?? "", // fallback for nullable description
        publishDate: new Date(a.publishDate).toISOString(), // normalized date format
        authorFirstName: a.authorFirstName ?? null, // fallback if no author
        authorLastName: a.authorLastName ?? null,
      };
    });
  } catch (err) {
    // Catch DB errors or validation failures
    console.error("Error fetching published articles:", err);
    return [];
  }
}
