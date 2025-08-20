import { db } from "../lib/db";
import { authors, articles } from "./schema";

// Utility: Generate random date in the last 6 months, clamped to now
function randomDate(start: Date, end: Date): Date {
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = Math.min(end.getTime(), now);
  return new Date(startTime + Math.random() * (endTime - startTime));
}

// SEO-friendly slugify (no id suffix)
function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function seed() {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(articles);
      await tx.delete(authors);

      // WFD team authors, parse first and last names roughly from full names, generate emails from slug
      const wfdAuthors = [
        { fullName: "Nedjma Benzekri", title: "Shaping the Future of Global Health Access" },
        { fullName: "Neha Arora", title: "Building Sustainable Financial Pathways" },
        { fullName: "Fibi Dalyop", title: "Turning Data Into Human Stories" },
        { fullName: "Maïte Karstanje", title: "Scaling Operations for Greater Impact" },
        { fullName: "Michell Montserrat Mor Andrade", title: "Driving Digital Transformation for Change" },
        { fullName: "Aanuoluwapo Ayoola Oladeji", title: "Cultivating People, Power, and Purpose" },
      ];

      const insertedAuthors = await tx
        .insert(authors)
        .values(
          wfdAuthors.map(({ fullName }) => {
            const parts = fullName.split(" ");
            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ") || "";
            const emailSlug = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, "");
            return {
              firstName,
              lastName,
              email: `${emailSlug}@wfdteam.example.com`,
            };
          })
        )
        .returning();

      if (insertedAuthors.length === 0) {
        throw new Error("No authors were inserted, aborting article seeding.");
      }

      // Article titles on productivity, work ethic, productivity rights focusing on the WFD themes
      const articleTitles = [
        "Mastering Productivity for Sustainable Success",
        "Ethics and Empathy in Modern Workplaces",
        "Understanding Productivity Rights in the Digital Era",
        "Balancing Technology and Human Potential",
        "Workplace Culture: The Heart of Productivity",
        "Empowering Teams with Purpose and Focus",
      ];

      // Content generation function retains the structure but uses our new titles
      function generateContent(title: string): string {
        return `
          <p>In this article titled "${title}", we explore the intricate themes and provide insightful analysis. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
          <p>The discussion on "${title}" covers recent trends, historical context, and future outlook. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry, specifically, the "${title}" domain. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...</p>
        `.trim();
      }

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const articlesData = articleTitles.map((title, idx) => {
        const author = insertedAuthors[idx % insertedAuthors.length];
        const publishDate = randomDate(sixMonthsAgo, new Date());

        return {
          title,
          slug: slugify(title),
          description: `A deep dive into "${title}", exploring its themes and impact.`,
          content: generateContent(title),
          authorId: author.id,
          publishDate: publishDate.toISOString(),
          isPublished: idx % 2 === 0, // half published, half draft
        };
      });

      await tx.insert(articles).values(articlesData);
    });

    console.log("✅ Seed completed with 6 WFD authors and 6 productivity-themed articles!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
