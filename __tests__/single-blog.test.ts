import { getArticleBySlug, Article } from "@/lib/single-blog";
import { db } from "@/lib/db";
import { articles, authors } from "@/db/schema";

// Mock the database module to isolate data layer for unit testing
jest.mock("@/lib/db");

describe("getArticleBySlug", () => {
  // Reset mocks before each test to avoid cross-test contamination
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns the article when found", async () => {
    // Sample article object to simulate database response
    const mockArticle: Article = {
      id: 1,
      title: "Test Article",
      description: "Description",
      content: "<p>Content</p>",
      publishDate: "2025-01-01",
      authorFirstName: "John",
      authorLastName: "Doe",
      authorEmail: "john@example.com",
    };

    // Mock the Drizzle ORM query chain to return the sample article
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            limit: () => ({
              execute: async () => [mockArticle], // Return array with one article
            }),
          }),
        }),
      }),
    });

    // Invoke the function under test
    const result = await getArticleBySlug("test-article");

    // Assert that the returned article matches the mock
    expect(result).toEqual(mockArticle);
  });

  it("returns null if no article is found", async () => {
    // Mock the Drizzle ORM query chain to return an empty array
    (db.select as jest.Mock).mockReturnValue({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            limit: () => ({
              execute: async () => [], // Simulate no articles found
            }),
          }),
        }),
      }),
    });

    // Invoke the function under test
    const result = await getArticleBySlug("missing-article");

    // Assert that the function returns null when article is not found
    expect(result).toBeNull();
  });
});
