import { Metadata } from "next";
import { getArticleBySlug } from "./single-blog";

export async function generateArticleMetadata(slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
    },
    twitter: {
      title: article.title,
      description: article.description,
    },
  };
}
