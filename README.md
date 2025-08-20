# Drizzle Blog

> A modern, read-only blog platform showcasing Next.js 15, TypeScript, Drizzle ORM, and best practices in web development.

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green?style=for-the-badge)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## Features

### Core Functionality
- **Article Display** - Read-only blog posts with dynamic routing
- **Author Information** - Display author names and publication dates
- **SEO Optimized** - Dynamic metadata generation for better search rankings
- **Responsive Design** - Beautiful UI across all devices
- **Performance** - Built with Next.js 15 App Router for optimal speed

### Technical Excellence
- **Comprehensive Testing** - 37 test cases with enhanced output
- **Type Safety** - Full TypeScript coverage with strict mode
- **Database Schema** - Well-designed schema with Drizzle ORM
- **Production Ready** - Optimized for Vercel deployment

---

## Tech Stack

| **Frontend** | **Backend** | **Database** | **Testing** |
|-------------|-------------|--------------|-------------|
| ![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js) | ![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql) | ![Jest](https://img.shields.io/badge/Jest-30.0-red?logo=jest) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) | ![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green) | ![Supabase](https://img.shields.io/badge/Supabase-Ready-green?logo=supabase) | ![Testing Library](https://img.shields.io/badge/Testing-Library-red) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css) | ![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-orange) | | |

---

## Quick Start

### Prerequisites
- **Node.js** 18.17+ 
- **PostgreSQL** 13+
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/drizzle-blog.git
cd drizzle-blog

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL

# 4. Set up the database
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

**Open [http://localhost:3000](http://localhost:3000)** in your browser.

---

## Project Structure

```
drizzle-blog/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── blog/           # Blog routes
│   │   │   ├── [slug]/     # Dynamic article pages
│   │   │   └── page.tsx    # Blog listing page
│   │   ├── layout.tsx      # Root layout with metadata
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable UI components
│   │   ├── ArticleCard.tsx    # Article preview cards
│   │   └── ArticleContent.tsx # Article display component
│   ├── db/                 # Database configuration
│   │   ├── schema.ts       # Drizzle schema definitions
│   │   └── seed.ts         # Database seeding script
│   └── lib/                # Utility functions
│       ├── blog.ts         # Blog data fetching
│       ├── single-blog.ts  # Single article fetching
│       └── seo-config.ts   # SEO metadata configuration
├── __tests__/              # Test files
└── public/                 # Static assets
```

---

## Database Schema

### Articles Table
| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | Unique identifier |
| `title` | `VARCHAR(255)` | NOT NULL | Article title |
| `slug` | `VARCHAR(255)` | UNIQUE, NOT NULL | URL-friendly identifier |
| `description` | `TEXT` | NOT NULL | Article summary |
| `content` | `TEXT` | NOT NULL | Full article content |
| `authorId` | `INTEGER` | FOREIGN KEY | Reference to authors.id |
| `publishDate` | `DATE` | NOT NULL | Publication date |
| `isPublished` | `BOOLEAN` | DEFAULT true | Publication status |
| `createdAt` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |

### Authors Table
| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | `SERIAL` | PRIMARY KEY | Unique identifier |
| `firstName` | `VARCHAR(100)` | NOT NULL | Author's first name |
| `lastName` | `VARCHAR(100)` | NOT NULL | Author's last name |
| `email` | `VARCHAR(255)` | UNIQUE | Contact email |
| `createdAt` | `TIMESTAMP` | DEFAULT NOW() | Creation timestamp |
| `updatedAt` | `TIMESTAMP` | DEFAULT NOW() | Last update timestamp |

---

## Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start development server with Turbopack | Development |
| `npm run build` | Build for production | Deployment |
| `npm run start` | Start production server | Production |
| `npm run lint` | Lint code with ESLint | Code quality |
| `npm run test` | Run Jest test suite | Testing |
| `npm run db:generate` | Generate database migrations | Database |
| `npm run db:push` | Push schema to database | Database |
| `npm run db:studio` | Open Drizzle Studio | Database |
| `npm run db:seed` | Seed database with sample data | Database |

---

## Testing

Our test suite includes **37 comprehensive test cases** with enhanced output:

### Blog Listing Logic
- ✅ **Successful Scenarios** - Data mapping and multiple articles
- ✅ **Data Validation** - Default values and date normalization  
- ✅ **Error Handling** - Database failures and malformed responses
- ✅ **Edge Cases** - Special characters and large datasets
- ✅ **Performance** - Efficiency testing

### Single Article Retrieval
- ✅ **Successful Retrieval** - Complete data and author information
- ✅ **Not Found Scenarios** - Missing articles and empty slugs
- ✅ **Data Validation** - Required fields and partial data
- ✅ **Error Handling** - Connection failures and validation errors
- ✅ **Edge Cases** - Long content and special characters
- ✅ **Performance** - Large content and concurrent requests
- ✅ **Integration** - Schema validation and data integrity

```bash
# Run all tests
npm run test

# Example output:
📚 Blog Listing Logic
  ✅ Successful Scenarios
    ✓ maps database results correctly with complete article data
    ✓ handles multiple articles with proper ordering and structure
  🚨 Error Handling & Resilience
    ✓ handles database connection failures gracefully
    ✓ handles query execution errors without crashing

Test Suites: 2 passed, 37 tests passed
```

---

## Environment Configuration

### Required Variables

Create a `.env.local` file:

```env
# Database Configuration
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/blogdb

# Optional: Supabase (for production)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Environment Setup Guide

| Environment | Database | Configuration |
|-------------|----------|---------------|
| **Development** | Local PostgreSQL | `postgres://user:pass@localhost:5432/blogdb` |
| **Production** | Supabase/Neon | Managed database service |
| **Testing** | Test Database | Isolated test environment |

---

## SEO & Metadata

### Metadata Features
- **Open Graph** - Social media optimization
- **Twitter Cards** - Enhanced Twitter previews  
- **Canonical URLs** - Prevent duplicate content
- **Structured Data** - Search engine optimization
- **Dynamic Generation** - Article-specific metadata

### Implementation Example

```typescript
// Dynamic metadata for articles
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateArticleMetadata(slug);
}

// Centralized SEO configuration
export const SITE_CONFIG = {
  name: "Drizzle Blog",
  description: "A minimal blog platform built with Next.js 15...",
  url: "https://drizzle-blog.vercel.app",
  keywords: ["blog", "nextjs", "typescript", "drizzle"],
};
```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your repository on [Vercel](https://vercel.com)
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables**
   ```env
   DATABASE_URL=your_production_database_url
   ```

### Docker (Alternative)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Development

### Key Features in Development

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Article Display | Complete | Read-only article viewing with dynamic routing |
| ✅ Author Information | Complete | Display author names and publication dates |
| ✅ SEO Optimization | Complete | Dynamic metadata generation |
| ✅ Responsive Design | Complete | Mobile-first approach |
| ✅ Testing Suite | Complete | 37 comprehensive tests |
| ✅ Type Safety | Complete | Full TypeScript coverage |

---

### Code Standards
- ✅ TypeScript strict mode
- ✅ ESLint configuration (Next.js core web vitals + TypeScript)
- ✅ Test coverage for new features
- ✅ Conventional commit messages (using "fix:" prefix)

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
