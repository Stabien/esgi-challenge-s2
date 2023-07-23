// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/');
    cy.contains('[data-cy=tracking]').should('have.value', 'Tracking');
  });
});
