import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

export function generateNewRecommendationBody() {
  return {
    name: faker.lorem.sentence(),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
  };
}

export function createRecommendation(score: number = undefined) {
  const body = generateNewRecommendationBody();
  return prisma.recommendation.create({
    data: {
      name: body.name,
      youtubeLink: body.youtubeLink,
      score: score || Math.floor(Math.random() * 10),
    },
  });
}
