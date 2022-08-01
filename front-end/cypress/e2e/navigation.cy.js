/// <reference types="cypress" />

describe("navigation tests", () => {
  it("should go to trending page", () => {
    cy.visit("http://localhost:3000");
    cy.get("#button-trendingPage").click();
    cy.url().should("equal", "http://localhost:3000/top");
  });

  it("should go to random page", () => {
    cy.get("#button-randomPage").click();
    cy.url().should("equal", "http://localhost:3000/random");
  });

  it("should go to home page", () => {
    cy.get("#button-homePage").click();
    cy.url().should("equal", "http://localhost:3000/");
  });
});
