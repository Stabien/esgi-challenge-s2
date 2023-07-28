describe('Test register', () => {
  // doesn't test register because can't
  it('Test error password', () => {
    const user = [
      { field: 'email', value: 'test@yopmail.com' },
      { field: 'firstname', value: 'register' },
      { field: 'lastname', value: 'last' },
      { field: 'society', value: 'society' },
      { field: 'url', value: 'https://test.fr' },
      { field: 'password', value: 'cacayolo' },
      { field: 'confirmPassword', value: 'zz' }
    ]; //dev
    // const user={email:'test@yopmail.com',password:'cacayolo'} ;//prod
    cy.visit('/join');
    user.forEach(({ field, value }) => {
      cy.get(`[data-cy=${field}]`).type(value);
    });
    cy.get(`[data-cy=file]`).selectFile('./public/cypressTest.PDF');
    cy.get('button[type=submit]').click();

    cy.contains("Password doesn't match").should('be.visible');
  });
  it('Test error url', () => {
    const user = [
      { field: 'email', value: 'test@yopmail.com' },
      { field: 'firstname', value: 'register' },
      { field: 'lastname', value: 'last' },
      { field: 'society', value: 'society' },
      { field: 'url', value: 'wrongUrl' },
      { field: 'password', value: 'cacayolo' },
      { field: 'confirmPassword', value: 'cacayolo' }
    ]; //dev
    // const user={email:'test@yopmail.com',password:'cacayolo'} ;//prod
    cy.visit('/join');
    user.forEach(({ field, value }) => {
      cy.get(`[data-cy=${field}]`).type(value);
    });
    cy.get(`[data-cy=file]`).selectFile('./public/cypressTest.PDF');
    cy.get('button[type=submit]').click();

    cy.contains('Url is not valid').should('be.visible');
  });
});
