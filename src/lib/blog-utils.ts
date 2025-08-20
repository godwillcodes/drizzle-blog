import { articles, authors } from "@/db/schema";
import { eq } from "drizzle-orm";

// Common Article type for blog operations
export type BaseArticle = {
  id: number;
  title: string;
  description: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
};

// Extended Article type for single article (includes content and email)
export type FullArticle = BaseArticle & {
  content: string;
  authorEmail?: string | null;
};

// List Article type (includes slug, no content)
export type ListArticle = BaseArticle & {
  slug: string;
};

// Common select fields for article queries
export const ARTICLE_SELECT_FIELDS = {
  id: articles.id,
  title: articles.title,
  description: articles.description,
  publishDate: articles.publishDate,
  authorFirstName: authors.firstName,
  authorLastName: authors.lastName,
} as const;

// Extended select fields for full article (includes content and email)
export const FULL_ARTICLE_SELECT_FIELDS = {
  ...ARTICLE_SELECT_FIELDS,
  content: articles.content,
  authorEmail: authors.email,
} as const;

// List article select fields (includes slug)
export const LIST_ARTICLE_SELECT_FIELDS = {
  ...ARTICLE_SELECT_FIELDS,
  slug: articles.slug,
} as const;

// Common join configuration
export const ARTICLE_AUTHOR_JOIN = eq(articles.authorId, authors.id);

// Normalize date to ISO string format
export function normalizeDate(date: string | Date): string {
  return new Date(date).toISOString();
}

// Apply default values to article fields
export function applyArticleDefaults<T extends Partial<BaseArticle>>(
  article: T,
  defaults: Partial<BaseArticle> = {}
): BaseArticle {
  return {
    id: article.id ?? 0,
    title: article.title ?? "Untitled",
    description: article.description ?? "",
    publishDate: article.publishDate ? normalizeDate(article.publishDate) : normalizeDate(new Date()),
    authorFirstName: article.authorFirstName ?? null,
    authorLastName: article.authorLastName ?? null,
    ...defaults,
  };
}

// Apply defaults to full article (includes content and email)
export function applyFullArticleDefaults<T extends Partial<FullArticle>>(
  article: T,
  defaults: Partial<FullArticle> = {}
): FullArticle {
  const baseDefaults = applyArticleDefaults(article, defaults);
  return {
    ...baseDefaults,
    content: article.content ?? "",
    authorEmail: article.authorEmail ?? null,
  };
}

// Apply defaults to list article (includes slug)
export function applyListArticleDefaults<T extends Partial<ListArticle>>(
  article: T,
  defaults: Partial<ListArticle> = {}
): ListArticle {
  const baseDefaults = applyArticleDefaults(article, defaults);
  return {
    ...baseDefaults,
    slug: article.slug ?? "untitled",
  };
}

// Validate required article fields
export function validateArticleFields(article: Record<string, unknown>, context: string = "article"): void {
  if (!article.id || !article.title || !article.publishDate) {
    throw new Error(`Invalid ${context} record: ${JSON.stringify(article)}`);
  }
}

// Validate required full article fields (includes content)
export function validateFullArticleFields(article: Record<string, unknown>, context: string = "article"): void {
  validateArticleFields(article, context);
  if (!article.content) {
    throw new Error(`Invalid ${context} record - missing content: ${JSON.stringify(article)}`);
  }
}
