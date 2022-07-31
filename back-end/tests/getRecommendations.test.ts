import app from "../src/app";
import supertest from "supertest";
import { createRecommendation } from "./factories/recommendationsFactory";
import { prisma } from "../src/database.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("GET /recommendations", () => {
  it("should return 10 last recommendations", async () => {
    let last10 = [];
    for (let i = 0; i < 11; i++) {
      const recommendation = await createRecommendation();
      if (i > 0) {
        last10.push(recommendation);
      }
    }
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(last10.reverse());
  });
});

describe("GET /recommendations/:id", () => {
  it("given valid id, should return recommendation", async () => {
    const recommendation = await createRecommendation();
    const response = await agent.get(`/recommendations/${recommendation.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendation);
  });

  it("given invalid id, should return 404", async () => {
    const response = await agent.get(`/recommendations/-1`);
    expect(response.status).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("should return random recommendation", async () => {
    const recommendation = await createRecommendation();
    const response = await agent.get("/recommendations/random");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendation);
  });

  it("should return 404 if there are no songs", async () => {
    const response = await agent.get("/recommendations/random");
    expect(response.status).toBe(404);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("should return :amount top recommendations", async () => {
    for (let i = 0; i < 5; i++) {
      await createRecommendation();
    }
    const response = await agent.get("/recommendations/top/3");
    expect(response.status).toBe(200);
    const recommendations = response.body;
    expect(recommendations.length).toBe(3);
    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].score).toBeGreaterThanOrEqual(
        recommendations[i + 1].score
      );
    }
  });

  it("should return empty array if there are no songs", async () => {
    const response = await agent.get("/recommendations/top/3");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
