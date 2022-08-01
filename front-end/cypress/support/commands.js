Cypress.Commands.add("resetDB", () => {
  cy.request("POST", `${process.env.REACT_APP_API_BASE_URL}/resetDB`);
});

Cypress.Commands.add("seedDB", () => {
  cy.request("POST", `${process.env.REACT_APP_API_BASE_URL}/seedDB`);
});
