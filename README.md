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

## Testing

Run all tests:

```bash
npm run test
```

---

## Deployment

1. Push repository to GitHub.  
2. Import into [Vercel](https://vercel.com/).  
3. Set `DATABASE_URL` in Vercel environment variables.  
4. Deploy.  

---

## Roadmap

- [ ] Add comments system  
- [ ] Rich text editor for articles  
- [ ] Pagination on blog listing  
- [ ] Search and filter functionality  

---

## License

MIT License.  
Free to use, modify, and distribute.
