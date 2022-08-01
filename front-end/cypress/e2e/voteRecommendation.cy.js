/// <reference types="cypress" />

describe("vote recommendation tests", () => {
  it("should upvote the recommendation", () => {
    cy.resetDB();
    cy.seedDB();

    cy.visit("http://localhost:3000");
    cy.get(".upVote").click();
    cy.get(".score").should("contain", "1");
  });

  it("should downvote the recommendation", () => {
    cy.visit("http://localhost:3000");
    cy.get(".downVote").click();
    cy.get(".score").should("contain", "0");
  });
});
