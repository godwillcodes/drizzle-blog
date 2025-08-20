import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  date,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const authors = pgTable(
  "authors",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({}),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("author_email_idx").on(table.email)]
);

export const articles = pgTable(
  "articles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),
    content: text("content").notNull(),
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    publishDate: date("publish_date").notNull(),
    isPublished: boolean("is_published").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("article_slug_idx").on(table.slug)]
);


export type Article = typeof articles.$inferSelect;
export type Author = typeof authors.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type InsertAuthor = typeof authors.$inferInsert;