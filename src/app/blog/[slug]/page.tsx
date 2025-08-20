import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/single-blog";
import ArticleContent from "@/components/ArticleContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;  // await here to get the slug string
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return <ArticleContent article={article} />;
}
