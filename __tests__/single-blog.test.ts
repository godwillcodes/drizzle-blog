import { getArticleBySlug, Article } from "@/lib/single-blog";
import { db } from "@/lib/db";
import type { FullArticle } from "@/lib/blog-utils";

// Mock the database module to isolate data layer for unit testing
jest.mock("@/lib/db");

// Test data factories for consistent, realistic test data
const createMockArticle = (overrides: Partial<FullArticle> = {}): FullArticle => ({
  id: 1,
  title: "Test Article",
  description: "A comprehensive test article for unit testing",
  content: "<p>This is a test article with rich HTML content.</p><p>It includes multiple paragraphs and formatting.</p>",
  publishDate: "2025-01-01T00:00:00.000Z",
  authorFirstName: "John",
  authorLastName: "Doe",
  authorEmail: "john.doe@example.com",
  ...overrides,
});

const createMockQuery = (result: any[]) => ({
  from: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue(result),
});

describe("📖 Single Article Retrieval", () => {
  let selectMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    selectMock = db.select as unknown as jest.Mock;
  });

  describe("✅ Successful Retrieval Scenarios", () => {
    it("🎯 retrieves complete article data with all fields populated", async () => {
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toEqual(mockArticle);
      expect(result).toMatchObject({
        id: 1,
        title: "Test Article",
        description: "A comprehensive test article for unit testing",
        content: expect.stringContaining("<p>"),
        publishDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        authorFirstName: "John",
        authorLastName: "Doe",
        authorEmail: "john.doe@example.com",
      });
    });

    it("👤 handles articles with minimal author information gracefully", async () => {
      const mockArticle = createMockArticle({
        authorFirstName: "Jane",
        authorLastName: null,
        authorEmail: null,
      });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toMatchObject({
        authorFirstName: "Jane",
        authorLastName: null,
        authorEmail: null,
      });
    });

    it("🎨 handles articles with complex HTML content and formatting", async () => {
      const complexContent = `
        <article>
          <h1>Main Title</h1>
          <p>Introduction paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
          <h2>Subsection</h2>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
          <blockquote>Important quote here</blockquote>
        </article>
      `;
      const mockArticle = createMockArticle({ content: complexContent });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result?.content).toBe(complexContent);
      expect(result?.content).toContain("<h1>");
      expect(result?.content).toContain("<ul>");
      expect(result?.content).toContain("<blockquote>");
    });
  });

  describe("🔍 Not Found & Missing Data Scenarios", () => {
    it("❌ returns null when article slug is not found", async () => {
      selectMock.mockReturnValue(createMockQuery([]));

      const result = await getArticleBySlug("missing-article");

      expect(result).toBeNull();
    });

    it("🚫 returns null for empty slug parameter", async () => {
      selectMock.mockReturnValue(createMockQuery([]));

      const result = await getArticleBySlug("");

      expect(result).toBeNull();
    });

    it("🔎 returns null for non-existent article slug", async () => {
      selectMock.mockReturnValue(createMockQuery([]));

      const result = await getArticleBySlug("this-slug-does-not-exist");

      expect(result).toBeNull();
    });
  });

  describe("🔧 Data Validation & Default Values", () => {
    it("🛡️ returns null when required article fields are missing", async () => {
      const incompleteArticle = {
        id: null,
        title: null,
        description: null,
        content: null,
        publishDate: null,
        authorFirstName: null,
        authorLastName: null,
        authorEmail: null,
      };
      selectMock.mockReturnValue(createMockQuery([incompleteArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("🎭 handles partial data gracefully with some fields present", async () => {
      const partialArticle = {
        id: 5,
        title: "Valid Title",
        description: "Valid description",
        content: "Valid content",
        publishDate: "2025-01-15",
        authorFirstName: "Jane",
        authorLastName: null,
        authorEmail: "jane@example.com",
      };
      selectMock.mockReturnValue(createMockQuery([partialArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toMatchObject({
        id: 5,
        title: "Valid Title",
        description: "Valid description",
        content: "Valid content",
        publishDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        authorFirstName: "Jane",
        authorLastName: null,
        authorEmail: "jane@example.com",
      });
    });

    it("📅 normalizes date formats consistently across different input formats", async () => {
      const articlesWithDifferentDates = [
        createMockArticle({ 
          id: 1, 
          publishDate: "2025-01-01" 
        }),
        createMockArticle({ 
          id: 2, 
          publishDate: "2025-12-31T23:59:59.999Z" 
        }),
        createMockArticle({ 
          id: 3, 
          publishDate: "2025-06-15T12:30:00.000Z" 
        }),
      ];

      for (let i = 0; i < articlesWithDifferentDates.length; i++) {
        selectMock.mockReturnValue(createMockQuery([articlesWithDifferentDates[i]]));
        const result = await getArticleBySlug(`article-${i + 1}`);
        
        expect(result?.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(new Date(result!.publishDate).toISOString()).toBe(result!.publishDate);
      }
    });
  });

  describe("🚨 Error Handling & Resilience", () => {
    it("💥 handles database connection failures gracefully", async () => {
      selectMock.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("⚡ handles query execution errors without crashing", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValue(new Error("Query execution failed")),
      });

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("🔍 handles malformed database responses safely", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue("not an array"),
      });

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("❓ handles null database responses without errors", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(null),
      });

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("🔒 handles validation errors gracefully with proper error handling", async () => {
      const invalidArticle = {
        id: null,
        title: null,
        content: null,
        publishDate: null,
      };
      selectMock.mockReturnValue(createMockQuery([invalidArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });
  });

  describe("🎪 Edge Cases & Special Scenarios", () => {
    it("📏 handles articles with very long content without performance issues", async () => {
      const longContent = "<p>" + "A".repeat(10000) + "</p>";
      const mockArticle = createMockArticle({ content: longContent });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result?.content).toBe(longContent);
      expect(result?.content.length).toBe(10007); // <p> + 10000 chars + </p>
    });

    it("🌈 handles articles with special characters and emojis in titles", async () => {
      const specialTitle = "Article with émojis 🚀 and symbols @#$% & <script>";
      const mockArticle = createMockArticle({ title: specialTitle });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result?.title).toBe(specialTitle);
    });

    it("🔤 returns null when content is empty (validation requirement)", async () => {
      const emptyStringArticle = createMockArticle({
        title: "",
        description: "",
        content: "",
        authorFirstName: "",
        authorLastName: "",
        authorEmail: "",
      });
      selectMock.mockReturnValue(createMockQuery([emptyStringArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toBeNull();
    });

    it("🔗 handles articles with very long slugs without issues", async () => {
      const longSlug = "a".repeat(255);
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug(longSlug);

      expect(result).toEqual(mockArticle);
    });

    it("🎭 handles articles with special characters in slugs correctly", async () => {
      const specialSlug = "article-with-émojis-🚀-and-symbols-@#$%";
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug(specialSlug);

      expect(result).toEqual(mockArticle);
    });
  });

  describe("⚡ Performance & Scalability", () => {
    it("🚀 handles large content efficiently within performance thresholds", async () => {
      const largeContent = "<p>" + "Content ".repeat(1000) + "</p>";
      const mockArticle = createMockArticle({ content: largeContent });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const startTime = performance.now();
      const result = await getArticleBySlug("test-article");
      const endTime = performance.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(50); // Should complete within 50ms
    });

    it("🔄 handles concurrent requests efficiently without conflicts", async () => {
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const startTime = performance.now();
      const promises = Array.from({ length: 10 }, () => getArticleBySlug("test-article"));
      const results = await Promise.all(promises);
      const endTime = performance.now();

      expect(results).toHaveLength(10);
      expect(results.every(result => result !== null)).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });
  });

  describe("🔗 Integration & Schema Validation", () => {
    it("📋 matches expected database schema structure with all required fields", async () => {
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const result = await getArticleBySlug("test-article");

      // Verify all expected fields are present
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("publishDate");
      expect(result).toHaveProperty("authorFirstName");
      expect(result).toHaveProperty("authorLastName");
      expect(result).toHaveProperty("authorEmail");
    });

    it("🔒 maintains data integrity through the entire retrieval process", async () => {
      const originalArticle = createMockArticle({
        id: 42,
        title: "Original Title",
        description: "Original description",
        content: "Original content",
        publishDate: "2025-01-01T00:00:00.000Z",
        authorFirstName: "Original",
        authorLastName: "Author",
        authorEmail: "original@example.com",
      });
      selectMock.mockReturnValue(createMockQuery([originalArticle]));

      const result = await getArticleBySlug("test-article");

      expect(result).toEqual(originalArticle);
      expect(result?.id).toBe(42);
      expect(result?.title).toBe("Original Title");
      expect(result?.authorFirstName).toBe("Original");
      expect(result?.authorLastName).toBe("Author");
    });
  });
});
