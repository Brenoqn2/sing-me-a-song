/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

describe("new recommendation tests", () => {
  it("should create a new recommendation", () => {
    const newRecommendation = {
      name: faker.lorem.sentence(),
      youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    };
    cy.visit("http://localhost:3000");
    cy.get("#name").type(newRecommendation.name);
    cy.get("#youtubeLink").type(newRecommendation.youtubeLink);
    cy.get("#button-newRecommendation").click();
  });
});
