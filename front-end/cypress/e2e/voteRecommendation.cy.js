/// <reference types="cypress" />

describe("vote recommendation tests", () => {
  it("should upvote all recommendations", () => {
    cy.visit("http://localhost:3000");
    cy.get(".upVote").click({ multiple: true });
  });

  it("should downvote all recommendations", () => {
    cy.visit("http://localhost:3000");
    cy.get(".downVote").click({ multiple: true });
  });
});
