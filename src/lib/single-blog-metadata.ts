import { Metadata } from "next";
import { getArticleBySlug } from "./single-blog";
import { generatePageMetadata } from "./seo-config";

export async function generateArticleMetadata(slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Generate article-specific metadata
  const title = article.title;
  const description = article.description;
  const path = `/blog/${slug}`;
  
  // Create author string for better SEO
  const authorName = article.authorFirstName && article.authorLastName 
    ? `${article.authorFirstName} ${article.authorLastName}`
    : article.authorFirstName || article.authorLastName || "Unknown Author";

  const enhancedDescription = `${description} By ${authorName}. Published on ${new Date(article.publishDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}.`;

  return generatePageMetadata(
    title,
    enhancedDescription,
    path
  );
}
