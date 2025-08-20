// Utility functions for database seeding

// Generate random date in the last 6 months
export function randomDate(start: Date, end: Date): Date {
  const now = Date.now();
  const startTime = start.getTime();
  const endTime = Math.min(end.getTime(), now);
  return new Date(startTime + Math.random() * (endTime - startTime));
}

// SEO-friendly slugify
export function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Parse full name into first and last name
export function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

// Generate email from name
export function generateEmail(firstName: string, lastName: string, domain: string): string {
  const emailSlug = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, "");
  return `${emailSlug}@${domain}`;
}

// Determine content template based on article title
export function getContentTemplate(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("workplace") || lowerTitle.includes("culture") || lowerTitle.includes("empathy")) {
    return "workplace";
  }
  
  if (lowerTitle.includes("technology") || lowerTitle.includes("digital") || lowerTitle.includes("balancing")) {
    return "technology";
  }
  
  return "productivity"; // default
}

// Determine description template based on article title
export function getDescriptionTemplate(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("workplace") || lowerTitle.includes("culture")) {
    return "workplace";
  }
  
  if (lowerTitle.includes("technology") || lowerTitle.includes("digital")) {
    return "technology";
  }
  
  return "default";
}

// Generate article content using templates
export function generateContent(title: string, templates: Record<string, (title: string) => string>): string {
  const templateType = getContentTemplate(title);
  const template = templates[templateType] || templates.productivity;
  return template(title).trim();
}

// Generate article description using templates
export function generateDescription(title: string, templates: Record<string, (title: string) => string>): string {
  const templateType = getDescriptionTemplate(title);
  const template = templates[templateType] || templates.default;
  return template(title);
}

// Convert date to database format
export function toDatabaseDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Validate seed data
export function validateSeedData(authors: readonly string[], articles: readonly string[]): void {
  if (!authors || authors.length === 0) {
    throw new Error("Seed authors data is empty or invalid");
  }
  
  if (!articles || articles.length === 0) {
    throw new Error("Seed articles data is empty or invalid");
  }
  
  // Check for duplicate titles (which would create duplicate slugs)
  const titles = articles.map(title => slugify(title));
  const uniqueTitles = new Set(titles);
  
  if (titles.length !== uniqueTitles.size) {
    throw new Error("Duplicate article titles detected - this would create duplicate slugs");
  }
}
