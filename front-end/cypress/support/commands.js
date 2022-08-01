console.log(Cypress.config());

Cypress.Commands.add("resetDB", () => {
  cy.request("POST", `/reset-database`);
});

Cypress.Commands.add("seedDB", () => {
  cy.request("POST", `/seed-database`);
});
