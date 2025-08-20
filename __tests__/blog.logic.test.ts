import { getPublishedArticles } from "@/lib/blog";
import { db } from "@/lib/db";
import type { ListArticle } from "@/lib/blog-utils";

// Mock the database module to isolate the data-fetching logic
jest.mock("@/lib/db");

// Test data factories for consistent, realistic test data
const createMockArticle = (overrides: Partial<ListArticle> = {}): ListArticle => ({
  id: 1,
  title: "Test Article",
  slug: "test-article",
  description: "A comprehensive test article for unit testing",
  publishDate: "2025-01-01T00:00:00.000Z",
  authorFirstName: "John",
  authorLastName: "Doe",
  ...overrides,
});

const createMockQuery = (result: any[]) => ({
  from: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockResolvedValue(result),
});

describe("📚 Blog Listing Logic", () => {
  let selectMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    selectMock = db.select as unknown as jest.Mock;
  });

  describe("✅ Successful Scenarios", () => {
    it("🎯 maps database results correctly with complete article data", async () => {
      const mockArticle = createMockArticle();
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        id: 1,
        title: "Test Article",
        slug: "test-article",
        description: "A comprehensive test article for unit testing",
        publishDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        authorFirstName: "John",
        authorLastName: "Doe",
      });
    });

    it("📋 handles multiple articles with proper ordering and structure", async () => {
      const mockArticles = [
        createMockArticle({ id: 1, title: "First Article", slug: "first-article" }),
        createMockArticle({ id: 2, title: "Second Article", slug: "second-article" }),
        createMockArticle({ id: 3, title: "Third Article", slug: "third-article" }),
      ];
      selectMock.mockReturnValue(createMockQuery(mockArticles));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(3);
      expect(articles[0].id).toBe(1);
      expect(articles[1].id).toBe(2);
      expect(articles[2].id).toBe(3);
   
      expect(articles).toEqual(expect.arrayContaining([
        expect.objectContaining({ title: "First Article" }),
        expect.objectContaining({ title: "Second Article" }),
        expect.objectContaining({ title: "Third Article" }),
      ]));
    });

    it("📭 returns empty array when no published articles exist", async () => {
      selectMock.mockReturnValue(createMockQuery([]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    });
  });

  describe("🔧 Data Validation & Default Values", () => {
    it("🛡️ applies sensible default values when database fields are missing", async () => {
      const incompleteArticle = {
        id: null,
        title: null,
        slug: null,
        description: null,
        publishDate: null,
        authorFirstName: null,
        authorLastName: null,
      };
      selectMock.mockReturnValue(createMockQuery([incompleteArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        id: 0,
        title: "Untitled",
        slug: "untitled",
        description: "",
        publishDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        authorFirstName: null,
        authorLastName: null,
      });
    });

    it("🎭 handles partial data gracefully with some fields present", async () => {
      const partialArticle = {
        id: 5,
        title: "Valid Title",
        slug: null,
        description: "Valid description",
        publishDate: "2025-01-15",
        authorFirstName: "Jane",
        authorLastName: null,
      };
      selectMock.mockReturnValue(createMockQuery([partialArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        id: 5,
        title: "Valid Title",
        slug: "untitled", // Default applied
        description: "Valid description",
        publishDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        authorFirstName: "Jane",
        authorLastName: null,
      });
    });

    it("📅 normalizes date formats consistently across all articles", async () => {
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
      selectMock.mockReturnValue(createMockQuery(articlesWithDifferentDates));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(3);
      articles.forEach(article => {
        expect(article.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(new Date(article.publishDate).toISOString()).toBe(article.publishDate);
      });
    });
  });

  describe("🚨 Error Handling & Resilience", () => {
    it("💥 handles database connection failures gracefully", async () => {
      selectMock.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    });

    it("⚡ handles query execution errors without crashing", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockRejectedValue(new Error("Query execution failed")),
      });

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    });

    it("🔍 handles malformed database responses safely", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue("not an array"),
      });

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    });

    it("❓ handles null database responses without errors", async () => {
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(null),
      });

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    });
  });

  describe("🎪 Edge Cases & Special Scenarios", () => {
    it("📏 handles articles with very long titles without truncation", async () => {
      const longTitle = "A".repeat(300);
      const mockArticle = createMockArticle({ title: longTitle });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe(longTitle);
    });

    it("🌈 handles articles with special characters and emojis in titles", async () => {
      const specialTitle = "Article with émojis 🚀 and symbols @#$%";
      const mockArticle = createMockArticle({ title: specialTitle });
      selectMock.mockReturnValue(createMockQuery([mockArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe(specialTitle);
    });

    it("🔤 handles articles with empty strings and applies appropriate defaults", async () => {
      const emptyStringArticle = createMockArticle({
        title: "",
        description: "",
        authorFirstName: "",
        authorLastName: "",
      });
      selectMock.mockReturnValue(createMockQuery([emptyStringArticle]));

      const articles = await getPublishedArticles();

      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        title: "", // Empty string should be preserved
        description: "", // Empty string should be preserved
        authorFirstName: "", // Empty string should be preserved
        authorLastName: "",
      });
    });
  });

  describe("⚡ Performance & Scalability", () => {
    it("🚀 handles large datasets efficiently within performance thresholds", async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) =>
        createMockArticle({
          id: i + 1,
          title: `Article ${i + 1}`,
          slug: `article-${i + 1}`,
        })
      );
      selectMock.mockReturnValue(createMockQuery(largeDataset));

      const startTime = performance.now();
      const articles = await getPublishedArticles();
      const endTime = performance.now();

      expect(articles).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });
  });
});