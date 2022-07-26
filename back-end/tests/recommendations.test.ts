import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import { generateNewRecommendationBody } from "./factories/recommendationsFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("POST /recommendations", () => {
  it("given valid name and youtube link, should return 201", async () => {
    const body = generateNewRecommendationBody();
    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(201);
  });

  it("given invalid name, should return 422", async () => {
    const body = generateNewRecommendationBody();
    body.name = "";
    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(422);
  });

  it("given invalid youtube link, should return 422", async () => {
    const body = generateNewRecommendationBody();
    body.youtubeLink = "";
    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(422);
  });

  it("given already used name, should return 409", async () => {
    const body = generateNewRecommendationBody();
    await prisma.recommendation.create({
      data: {
        name: body.name,
        youtubeLink: "https://www.youtube.com/watch?v=QDAHMMMtFBI",
      },
    });
    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(409);
  });

  it("given already used youtube link, should return 409", async () => {
    const body = generateNewRecommendationBody();
    await prisma.recommendation.create({
      data: {
        name: "not used name",
        youtubeLink: body.youtubeLink,
      },
    });
    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(409);
  });
});
