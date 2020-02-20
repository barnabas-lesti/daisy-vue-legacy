const data = require('../../data');

describe('Auth / Sign in', () => {
  it('Should have a link to the registration page', () => {
    cy.visit('/sign-in');
    cy.get('[data-qa="views.signIn.form.registerLink"]').click();
    cy.url().should('include', '/register');
  });

  it('Should navigate to the sign in page if user is not authenticated', () => {
    cy.visit('/');
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const user = data.generateUser();
    cy.visit('/sign-in');

    cy.get('[data-qa="views.signIn.form"]').submit();
    cy.get('[data-qa="views.signIn.form"]').contains(/email.*required/i).should('be.visible');
    cy.get('[data-qa="views.signIn.form"]').contains(/password.*required/i).should('be.visible');

    cy.get('[data-qa="views.signIn.form.email"]').type(user.email);
    cy.get('[data-qa="views.signIn.form.password"]').type(user.password);
    cy.get('[data-qa="views.signIn.form"]').contains(/email.*required/i).should('not.exist');
    cy.get('[data-qa="views.signIn.form"]').contains(/password.*required/i).should('not.exist');
  });

  it('Should display error if authentication fails', () => {
    cy['auth/registerUser']()
      .then(user => {
        const nonExistingUser = data.generateUser();
        cy.visit('/sign-in');

        cy.get('[data-qa="views.signIn.form.email"]').type(nonExistingUser.email);
        cy.get('[data-qa="views.signIn.form.password"]').type(nonExistingUser.password);
        cy.get('[data-qa="views.signIn.form"]').submit();
        cy.get('[data-qa="views.signIn.form"]').contains(/invalid.*credentials/i).should('be.visible');

        cy.get('[data-qa="views.signIn.form.email"]').clear().type(user.email);
        cy.get('[data-qa="views.signIn.form.password"]').type(nonExistingUser.password);
        cy.get('[data-qa="views.signIn.form"]').submit();
        cy.get('[data-qa="views.signIn.form"]').contains(/invalid.*credentials/i).should('be.visible');
      });
  });

  it('Should sign in the user', () => {
    cy['auth/registerUser']()
      .then(user => {
        cy.visit('/?test=10');

        cy.get('[data-qa="views.signIn.form.email"]').type(user.email);
        cy.get('[data-qa="views.signIn.form.password"]').type(user.password);
        cy.get('[data-qa="views.signIn.form.submit"]').click();

        cy.get('[data-qa="notifications"]').contains(new RegExp(`signed.*in.*${user.email}`, 'i')).should('be.visible');
        cy.url().should('not.include', '/sign-in');
        cy.url().should('include', '?test=10');
      });
  });

  it('Should authenticate the user if tokens are set', () => {
    cy['auth/signIn']()
      .then(() => {
        cy.visit('/?test=10');

        cy.url().should('not.include', '/sign-in');
        cy.url().should('include', '?test=10');
      });
  });
});
