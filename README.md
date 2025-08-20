# Simple Blog Application

A minimal blog platform built with **Next.js 15**, **TypeScript**, **Drizzle ORM**, and **Tailwind CSS**.  
Implements article listing and detail pages with author relationships, responsive UI, and SEO-friendly metadata.

---

## Features

- Blog listing page (`/blog`) with:
  - Title, author, description, publish date
  - Clickable cards linking to full articles
- Article detail page (`/blog/[slug]`) with:
  - Full article content
  - Author details
  - Only displays published articles
- Database powered by **Drizzle ORM** with:
  - **Articles** table
  - **Authors** table
- Responsive design with Tailwind CSS
- SEO metadata generation
- Error handling & loading states
- Unit tests with Jest
- Ready for deployment on Vercel

---

## Tech Stack

- [Next.js 14+ (App Router)](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/)

---

## Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/your-username/simple-blog.git
cd simple-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory with:

```env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/blogdb
```

### 4. Run Database Migrations & Seed
```bash
npm run db:push
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Scripts

- `npm run dev` – Start development server  
- `npm run build` – Build production bundle  
- `npm run start` – Run production server  
- `npm run lint` – Lint code  
- `npm run test` – Run Jest tests  
- `npm run db:push` – Push Drizzle schema to database  
- `npm run db:seed` – Seed database with sample data  

---

## Database Schema

### Articles
| Column       | Type        | Notes               |
|--------------|-------------|---------------------|
| id           | Integer     | Primary key         |
| title        | String      | Article title       |
| slug         | String      | URL identifier      |
| description  | String      | Summary             |
| content      | Text        | Full text           |
| authorId     | Foreign key | References Authors  |
| publishDate  | Date        | Publish date        |
| isPublished  | Boolean     | Published status    |

### Authors
| Column     | Type    | Notes       |
|------------|---------|-------------|
| id         | Integer | Primary key |
| firstName  | String  | First name  |
| lastName   | String  | Last name   |
| email      | String  | Optional    |

---

## SEO Metadata

The application implements comprehensive SEO metadata generation using Next.js App Router's metadata API.

### Page-Level Metadata

#### `/blog` - Blog Listing Page
- **Static metadata** defined in `src/app/blog/page.tsx`
- Includes title, description, and Open Graph tags for the blog listing
- Optimized for social media sharing and search engine indexing

#### `/blog/[slug]` - Individual Article Pages
- **Dynamic metadata** generated using `generateMetadata()` function
- Metadata is generated based on the specific article content
- Includes article title, description, and author information

### Metadata Implementation

```typescript
// Example: Dynamic metadata generation for articles
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateArticleMetadata(slug);
}
```

### Updating Metadata

To modify metadata for any page:

1. **Static pages**: Update the `metadata` export in the page component
2. **Dynamic pages**: Modify the `generateMetadata` function
3. **Global metadata**: Update `src/app/layout.tsx` for site-wide defaults

### Metadata Features

- **Open Graph**: Optimized for social media sharing
- **Twitter Cards**: Enhanced Twitter previews
- **Structured Data**: SEO-friendly markup
- **Canonical URLs**: Prevents duplicate content issues

## Error Handling

The application implements robust error handling for various failure scenarios.

### Database Failures

- **Connection errors**: Graceful fallback with user-friendly error messages
- **Query failures**: Error boundaries catch and display appropriate UI
- **Timeout handling**: Automatic retry logic for transient failures

### Missing Content

#### Article Not Found (`/blog/[slug]`)
```typescript
if (!article) notFound(); // Returns 404 page
```
- Uses Next.js `notFound()` function for proper 404 handling
- Custom 404 page with navigation back to blog listing

#### Blog Listing Page (`/blog`)
- **No articles**: Displays empty state with helpful message
- **Database errors**: Shows fallback UI with retry option
- **Loading states**: Skeleton UI during data fetching

### Error Boundaries

- **Component-level**: Individual components handle their own errors
- **Page-level**: Fallback UI for entire page failures
- **Global**: Root error boundary for unhandled exceptions

## Environment Variables

### Required Variables

```env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/blogdb
```

### Validation

The application validates environment variables on startup:

```typescript
// Example validation from src/lib/db.ts
const base = process.env.POSTGRES_URL;
if (!base || !base.startsWith("postgres://")) {
  throw new Error("POSTGRES_URL must be a valid postgres:// URL");
}
```

### Production SSL Configuration

For production deployments (e.g., Vercel), SSL parameters are automatically handled:

```typescript
const sslParam = "sslmode=no-verify";
const connectionString = base.includes("sslmode=")
  ? base
  : base.includes("?")
    ? `${base}&${sslParam}`
    : `${base}?${sslParam}`;
```

### Environment Setup

1. **Development**: Use local PostgreSQL instance
2. **Production**: Use managed database service (e.g., Supabase, Neon)
3. **Testing**: Use test database or mocks

## Data Seeding

The application includes a comprehensive seeding system for development and testing.

### Seed Script

```bash
npm run db:seed
```

### Sample Seed Data

```typescript
// Example from src/db/seed.ts
const authors = [
  { firstName: "James", lastName: "Clear", email: "james.clear@example.com" },
  { firstName: "Yuval", lastName: "Harari", email: "yuval.harari@example.com" },
];

const articles = [
  {
    title: "Atomic Habits and the Science of Change",
    slug: "atomic-habits-science-change",
    description: "Understanding how small changes lead to remarkable results",
    content: "<p>Article content...</p>",
    authorId: 1,
    publishDate: "2024-01-15",
    isPublished: true,
  },
];
```

### Seeding Process

1. **Clean database**: Removes existing data
2. **Insert authors**: Creates author records
3. **Insert articles**: Creates article records with proper relationships
4. **Validation**: Ensures data integrity and relationships

### Custom Seeding

To add custom seed data:

1. Modify `src/db/seed.ts`
2. Add new authors and articles
3. Run `npm run db:seed` to apply changes

## Type Definitions

### Article Interface

```typescript
export type Article = {
  id: number;
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  authorFirstName: string | null;
  authorLastName: string | null;
};
```

### Database Schema Types

```typescript
// Authors table
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => authors.id),
  publishDate: date("publish_date").notNull(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Function Return Types

- **`getPublishedArticles()`**: Returns `Promise<Article[]>`
- **`getArticleBySlug(slug: string)`**: Returns `Promise<Article | null>`
- **`generateArticleMetadata(slug: string)`**: Returns `Promise<Metadata>`

## Testing

The application includes comprehensive unit tests to ensure data fetching logic works correctly and handles edge cases properly.

### Running Tests

```bash
npm run test
```

### Test Files

#### `__tests__/blog.logic.test.ts`
Tests the blog listing functionality and data mapping:

- **`maps DB results correctly`**: Verifies that database results are properly mapped to the expected format, ensuring fields like title, slug, description, and author names are correctly extracted and preserved.

- **`applies default values when fields are missing`**: Tests the robustness of the data layer by ensuring default values are applied when database fields are null or undefined (e.g., "Untitled" for missing titles, null for missing author names).

#### `__tests__/single-blog.test.ts`
Tests individual article retrieval functionality:

- **`returns the article when found`**: Verifies that `getArticleBySlug()` correctly returns a complete article object with all expected fields (id, title, description, content, publishDate, author details) when a valid slug is provided.

- **`returns null if no article is found`**: Ensures the function gracefully handles cases where an article doesn't exist by returning null instead of throwing an error.

### Test Strategy

- **Isolation**: Tests use Jest mocks to isolate the data layer from actual database connections
- **Edge Cases**: Tests cover both successful scenarios and error conditions
- **Data Integrity**: Verifies that database field mapping preserves data correctly
- **Default Values**: Ensures the application handles missing or null data gracefully

### Test Coverage

The tests focus on the core business logic:
- Article listing and filtering (published articles only)
- Individual article retrieval by slug
- Data transformation and mapping
- Error handling and edge cases

---

## Deployment

1. Push repository to GitHub.  
2. Import into [Vercel](https://vercel.com/).  
3. Set `DATABASE_URL` in Vercel environment variables.  
4. Deploy.  

---

## License

MIT License.  
Free to use, modify, and distribute.
