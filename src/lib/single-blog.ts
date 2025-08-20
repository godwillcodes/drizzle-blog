import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { 
  type FullArticle, 
  FULL_ARTICLE_SELECT_FIELDS, 
  ARTICLE_AUTHOR_JOIN, 
  applyFullArticleDefaults,
  validateFullArticleFields
} from "./blog-utils";

// Re-export the type for backward compatibility
export type Article = FullArticle;

/**
 * Fetch a single published article by its slug.
 * Returns null if not found or if an error occurs.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    // Query DB for a published article matching the slug
    const result = await db
      .select(FULL_ARTICLE_SELECT_FIELDS)
      .from(articles)
      .leftJoin(authors, ARTICLE_AUTHOR_JOIN)
      .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
      .limit(1) // Ensure only one record is returned
      .execute();

    const article = result?.[0];
    if (!article) return null; // No article found

    // Validate required fields before returning
    validateFullArticleFields(article, `article with slug "${slug}"`);

    // Normalize optional values and return a consistent Article object
    return applyFullArticleDefaults(article);
  } catch (err) {
    // Catch DB errors, schema mismatches, or validation errors
    console.error(`Error fetching article by slug "${slug}":`, err);
    return null;
  }
}
