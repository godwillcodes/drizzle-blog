import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/single-blog";
import { generateArticleMetadata } from "@/lib/single-blog-metadata";
import ArticleContent from "@/components/ArticleContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateArticleMetadata(slug);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;  // await here to get the slug string
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return <ArticleContent article={article} />;
}
