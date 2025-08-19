import { db } from "../lib/db";
import { authors, articles } from "./schema";

// Utility: Generate random date in the last 10 years, clamped to now
function randomDate(start: Date, end: Date): Date {
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = Math.min(end.getTime(), now);
  return new Date(startTime + Math.random() * (endTime - startTime));
}

// Utility: slugify the title and append index on collision fallback
function slugify(title: string, idx: number): string {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return `${baseSlug}-${idx}`;
}

async function seed() {
  try {
    await db.transaction(async (tx) => {
      // Clear existing data for idempotency (alternative: use onConflictDoNothing)
      await tx.delete(articles);
      await tx.delete(authors);

      // Insert known contemporary authors - unique by email
      const insertedAuthors = await tx
        .insert(authors)
        .values([
          { firstName: "James", lastName: "Clear", email: "james.clear@example.com" },
          { firstName: "Yuval", lastName: "Harari", email: "yuval.harari@example.com" },
          { firstName: "Colleen", lastName: "Hoover", email: "colleen.hoover@example.com" },
          { firstName: "Michelle", lastName: "Obama", email: "michelle.obama@example.com" },
          { firstName: "Walter", lastName: "Isaacson", email: "walter.isaacson@example.com" },
          { firstName: "Emily", lastName: "St. John Mandel", email: "emily.mandel@example.com" },
          { firstName: "Tara", lastName: "Westover", email: "tara.westover@example.com" },
          { firstName: "Andy", lastName: "Weir", email: "andy.weir@example.com" },
          { firstName: "Sally", lastName: "Rooney", email: "sally.rooney@example.com" },
          { firstName: "Trevor", lastName: "Noah", email: "trevor.noah@example.com" },
        ])
        .returning();

      if (insertedAuthors.length === 0) {
        throw new Error("No authors were inserted, aborting article seeding.");
      }

      // Article titles inspired by bestsellers & trending themes
      const articleTitles = [
        "Atomic Habits and the Science of Change",
        "The Future of Humanity in 21 Lessons",
        "Love and Loss in the Digital Age",
        "Becoming: The Power of Personal Story",
        "The Biography of Innovation",
        "Post-Pandemic Narratives",
        "Educated Minds, Divided Worlds",
        "From Mars to Metaverse",
        "Normal People in an Abnormal Time",
        "Born a Crime: Lessons in Resilience",
        "AI in Everyday Life",
        "Climate Change and Us",
        "The Psychology of Money",
        "Narratives That Shape Nations",
        "The Rise of Indie Publishing",
        "How to Stay Creative Under Pressure",
        "The Art of Minimalism",
        "Why Stories Matter",
        "Disruption in Healthcare",
        "The Future of Work and Learning",
      ];

      // Build a more realistic multi-paragraph content generator
      function generateContent(title: string): string {
        return `
          <p>In this article titled "${title}", we explore the intricate themes and provide insightful analysis.</p>
          <p>The discussion covers recent trends, historical context, and future outlook. Readers will gain a comprehensive understanding of the subject matter.</p>
          <p>Expert opinions and real-world examples enhance the reader's engagement and learning experience.</p>
        `.trim();
      }

      // Prepare articles data with slug collision protection and realistic content
      const articlesData = articleTitles.map((title, idx) => {
        const author = insertedAuthors[idx % insertedAuthors.length];
        const publishDate = randomDate(
          new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
          new Date()
        );

        return {
          title,
          slug: slugify(title, idx), // append idx to avoid collisions
          description: `A deep dive into "${title}", exploring its themes and impact.`,
          content: generateContent(title),
          authorId: author.id,
          publishDate,
          isPublished: idx % 5 !== 0, // every 5th article is a draft
        };
      });

      // Bulk insert articles
      await tx.insert(articles).values(articlesData);
    });

    console.log("✅ Seed completed with idempotency, slug safety, and improved content!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();