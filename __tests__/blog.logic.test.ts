import { getPublishedArticles } from "@/lib/blog";
import { db } from "@/lib/db";

// Mock the database module to isolate the data-fetching logic
jest.mock("@/lib/db");

describe("getPublishedArticles", () => {
  // Clear mocks before each test to prevent test pollution
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps DB results correctly", async () => {
    // Cast db.select to jest.Mock to enable mocking its return value
    const selectMock = db.select as unknown as jest.Mock;

    // Mock the Drizzle ORM chain to simulate a database response
    selectMock.mockReturnValue({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: async () => [
              {
                id: 1,
                title: "Test",
                slug: "test",
                description: "desc",
                publishDate: "2025-01-01",
                authorFirstName: "John",
                authorLastName: "Doe",
              },
            ],
          }),
        }),
      }),
    });

    // Call the function under test
    const articles = await getPublishedArticles();

    // Assert that the mapping preserves the DB fields correctly
    expect(articles[0].title).toBe("Test");
    expect(articles[0].authorFirstName).toBe("John");
  });

  it("applies default values when fields are missing", async () => {
    // Cast db.select to jest.Mock for mocking
    const selectMock = db.select as unknown as jest.Mock;

    // Mock the DB to return an incomplete record
    selectMock.mockReturnValue({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: async () => [{}], // Simulate missing fields
          }),
        }),
      }),
    });

    // Invoke the function
    const articles = await getPublishedArticles();

    // Assert that defaults are applied when DB fields are missing
    expect(articles[0].title).toBe("Untitled");
    expect(articles[0].authorFirstName).toBeNull();
  });
});
