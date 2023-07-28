describe('Test dark theme', () => {
  it('test dark mode toggle', () => {
    cy.visit('/');
    cy.get('html').should('not.have.class', 'dark');
    cy.get(`[data-cy=toggle-darkmode]`).click();
    cy.get('html').should('have.class', 'dark');
    cy.get(`[data-cy=toggle-darkmode]`).click();
  });
});
