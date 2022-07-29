import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import { generateNewRecommendationBody } from "./factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("POST /recommendations/:id/upvote", () => {
  it("given valid id, should return 200 and body should be empty", async () => {
    const body = generateNewRecommendationBody();
    const recommendation = await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: body.youtubeLink,
      },
    });
    const response = await agent.post(
      `/recommendations/${recommendation.id}/upvote`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  it("given invalid id, should return 404", async () => {
    const response = await agent.post(`/recommendations/-1/upvote`);
    expect(response.status).toBe(404);
  });

  it("given not numeric id, should return 404", async () => {
    const response = await agent.post(`/recommendations/a/upvote`);
    expect(response.status).toBe(404);
  });

  it("given valid id, should increase score by 1", async () => {
    const body = generateNewRecommendationBody();
    const recommendation = await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: body.youtubeLink,
      },
    });
    await agent.post(`/recommendations/${recommendation.id}/upvote`);
    const recommendationAfter = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id,
      },
    });
    expect(recommendationAfter.score).toBe(1);
  });
});

describe("POST /recommendations/:id/downvote", () => {
  it("given valid id, should return 200 and empty body", async () => {
    const body = generateNewRecommendationBody();
    const recommendation = await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: body.youtubeLink,
      },
    });
    const response = await agent.post(
      `/recommendations/${recommendation.id}/downvote`
    );
    expect(response.body).toEqual({});
    expect(response.status).toBe(200);
  });

  it("given invalid id, should return 404", async () => {
    const response = await agent.post(`/recommendations/-1/downvote`);
    expect(response.status).toBe(404);
  });

  it("given not numeric id, should return 404", async () => {
    const response = await agent.post(`/recommendations/a/downvote`);
    expect(response.status).toBe(404);
  });

  it("given valid id, should decrease score by 1", async () => {
    const body = generateNewRecommendationBody();
    const recommendation = await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: body.youtubeLink,
      },
    });
    await agent.post(`/recommendations/${recommendation.id}/downvote`);
    const recommendationAfter = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id,
      },
    });
    expect(recommendationAfter.score).toBe(-1);
  });

  it("given valid id, recommendation should be excluded if score < 5", async () => {
    const body = generateNewRecommendationBody();
    const recommendation = await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: body.youtubeLink,
        score: -5,
      },
    });
    await agent.post(`/recommendations/${recommendation.id}/downvote`);
    const recommendationAfter = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id,
      },
    });
    expect(recommendationAfter).toBe(undefined);
  });
});
