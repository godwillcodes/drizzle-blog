import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/single-blog";
import ArticleContent from "@/components/ArticleContent";

interface Props {
  params: { slug: string };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  return <ArticleContent article={article} />;
}