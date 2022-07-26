import { faker } from "@faker-js/faker";

export function generateNewRecommendationBody() {
  return {
    name: faker.lorem.sentence(),
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
  };
}
