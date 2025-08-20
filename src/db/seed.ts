import { db } from "../lib/db";
import { authors, articles } from "./schema";
import type { InsertAuthor, InsertArticle } from "./schema";
import { 
  SEED_AUTHORS, 
  SEED_ARTICLES, 
  CONTENT_TEMPLATES, 
  DESCRIPTION_TEMPLATES, 
  EMAIL_CONFIG 
} from "./seed-data";
import {
  randomDate,
  slugify,
  parseName,
  generateEmail,
  generateContent,
  generateDescription,
  toDatabaseDate,
  validateSeedData,
} from "./seed-utils";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Validate seed data before proceeding
    validateSeedData(SEED_AUTHORS, SEED_ARTICLES);
    
    await db.transaction(async (tx) => {
      // Clear existing data
      console.log("🧹 Clearing existing data...");
      await tx.delete(articles);
      await tx.delete(authors);

      // Insert authors
      console.log("👥 Inserting authors...");
      const authorData: InsertAuthor[] = SEED_AUTHORS.map((fullName) => {
        const { firstName, lastName } = parseName(fullName);
        return {
          firstName,
          lastName,
          email: generateEmail(firstName, lastName, EMAIL_CONFIG.domain),
        };
      });

      const insertedAuthors = await tx
        .insert(authors)
        .values(authorData)
        .returning();

      if (insertedAuthors.length === 0) {
        throw new Error("Failed to insert authors");
      }

      console.log(`✅ Inserted ${insertedAuthors.length} authors`);

      // Insert articles
      console.log("📝 Inserting articles...");
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const articleData: InsertArticle[] = SEED_ARTICLES.map((title, idx) => {
        const author = insertedAuthors[idx % insertedAuthors.length];
        const publishDate = randomDate(sixMonthsAgo, new Date());

        return {
          title,
          slug: slugify(title),
          description: generateDescription(title, DESCRIPTION_TEMPLATES),
          content: generateContent(title, CONTENT_TEMPLATES),
          authorId: author.id,
          publishDate: toDatabaseDate(publishDate),
          isPublished: idx % 2 === 0, // Alternate between published and draft
        };
      });

      const insertedArticles = await tx
        .insert(articles)
        .values(articleData)
        .returning();

      console.log(`✅ Inserted ${insertedArticles.length} articles`);
    });

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary: ${SEED_AUTHORS.length} authors, ${SEED_ARTICLES.length} articles`);
    
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();
