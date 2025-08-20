// Seed data definitions - separated from seeding logic

export const SEED_AUTHORS = [
  "Nedjma Benzekri",
  "Neha Arora", 
  "Fibi Dalyop",
  "Maïte Karstanje",
  "Michell Montserrat Mor Andrade",
  "Aanuoluwapo Ayoola Oladeji",
] as const;

export const SEED_ARTICLES = [
  "Mastering Productivity for Sustainable Success",
  "Ethics and Empathy in Modern Workplaces", 
  "Understanding Productivity Rights in the Digital Era",
  "Balancing Technology and Human Potential",
  "Workplace Culture: The Heart of Productivity",
  "Empowering Teams with Purpose and Focus",
] as const;

// Content templates for articles
export const CONTENT_TEMPLATES = {
  productivity: (title: string) => `
    <p>In this comprehensive exploration of "${title}", we delve into the fundamental principles and practical applications that drive success in modern workplaces.</p>
    
    <p>The article examines how "${title}" intersects with contemporary challenges, offering actionable insights for professionals seeking to enhance their productivity and workplace effectiveness.</p>
    
    <p>Through detailed analysis and real-world examples, we demonstrate how implementing these strategies can lead to sustainable improvements in both individual and organizational performance.</p>
  `,
  
  workplace: (title: string) => `
    <p>This article explores "${title}" and its profound impact on organizational culture and employee well-being.</p>
    
    <p>We examine the key factors that contribute to successful workplace environments and how "${title}" can be leveraged to create more inclusive, productive, and fulfilling work experiences.</p>
    
    <p>The discussion includes practical strategies, case studies, and expert insights to help organizations implement these principles effectively.</p>
  `,
  
  technology: (title: string) => `
    <p>In "${title}", we investigate the intersection of technology and human potential in modern work environments.</p>
    
    <p>This exploration covers emerging trends, best practices, and strategic approaches for leveraging technology to enhance productivity while maintaining human-centric values.</p>
    
    <p>We provide actionable guidance for organizations looking to balance technological advancement with sustainable, people-focused workplace practices.</p>
  `,
} as const;

// Description templates
export const DESCRIPTION_TEMPLATES = {
  default: (title: string) => `A deep dive into "${title}", exploring its themes and impact on modern productivity.`,
  workplace: (title: string) => `An exploration of "${title}" and its role in shaping positive workplace cultures.`,
  technology: (title: string) => `Understanding "${title}" in the context of technological advancement and human potential.`,
} as const;

// Email domain configuration
export const EMAIL_CONFIG = {
  domain: "wfdteam.example.com",
  format: "firstname.lastname",
} as const;
