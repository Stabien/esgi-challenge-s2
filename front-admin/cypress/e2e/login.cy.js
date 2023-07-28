describe('Login', () => {
  it('Login a user', () => {
    // const user = { email: 'test@yopmail.com', password: 'cacayolo' }; //dev
    const user = { email: 'bastien.piedallu@sfr.fr', password: 'test' }; //prod
    cy.visit('/login');
    cy.get('input[type=email]').type(user.email);
    cy.get('input[type=password]').type(user.password);
    cy.get('button[type=submit]').click();

    cy.get('[data-cy=logout]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy=logout]').click();
  });
  it('Login an admin', () => {
    // const user = { email: 'admin@yopmail.com', password: 'cacayolo' }; //dev
    const user = { email: 'admin@admin.fr', password: 'test' }; //prod
    cy.visit('/login-admin');
    cy.get('input[type=email]').type(user.email);
    cy.get('input[type=password]').type(user.password);
    cy.get('button[type=submit]').click();

    cy.get('[data-cy=logout]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy=logout]').click();
  });
});
