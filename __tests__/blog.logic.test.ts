import { getPublishedArticles } from "@/lib/blog";
import { db } from "@/lib/db";

jest.mock("@/lib/db");

describe("getPublishedArticles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps DB results correctly", async () => {
    // Cast db.select once to jest.Mock
    const selectMock = db.select as unknown as jest.Mock;

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

    const articles = await getPublishedArticles();
    expect(articles[0].title).toBe("Test");
    expect(articles[0].authorFirstName).toBe("John");
  });

  it("applies default values when fields are missing", async () => {
    const selectMock = db.select as unknown as jest.Mock;

    selectMock.mockReturnValue({
      from: () => ({
        leftJoin: () => ({
          where: () => ({
            orderBy: async () => [{}],
          }),
        }),
      }),
    });

    const articles = await getPublishedArticles();
    expect(articles[0].title).toBe("Untitled");
    expect(articles[0].authorFirstName).toBeNull();
  });
});
