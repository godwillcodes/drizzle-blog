import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { 
  type ListArticle, 
  LIST_ARTICLE_SELECT_FIELDS, 
  ARTICLE_AUTHOR_JOIN, 
  applyListArticleDefaults 
} from "./blog-utils";

// Re-export the type for backward compatibility
export type Article = ListArticle;

/**
 * Fetch all published articles from the database.
 * Returns an array of Article objects, or an empty array if an error occurs.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    // Query DB for all published articles with author info
    const result = await db
      .select(LIST_ARTICLE_SELECT_FIELDS)
      .from(articles)
      .leftJoin(authors, ARTICLE_AUTHOR_JOIN) // optional author info
      .where(eq(articles.isPublished, true)) // only published articles
      .orderBy(desc(articles.publishDate)); // newest first

    // Apply default values and normalize results
    return result.map((article) => applyListArticleDefaults(article));
  } catch (err) {
    // Catch DB errors or validation failures
    console.error("Error fetching published articles:", err);
    return [];
  }
}
