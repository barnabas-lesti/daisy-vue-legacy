const data = require('../../data');

const $form = () => cy.get('[data-qa="signIn.form"]');
const $email = () => $form().get('[data-qa="signIn.form.email"]');
const $password = () => $form().get('[data-qa="signIn.form.password"]');
const $submitButton = () => $form().get('[data-qa="signIn.form.submit"]');
const $registerLink = () => cy.get('[data-qa="signIn.form.registerLink"]');
const $notifications = () => cy.get('[data-qa="notifications"]');

describe('Auth / Sign in', () => {
  it('Should have a link to the registration page', () => {
    cy.visit('/sign-in');
    $registerLink().click();
    cy.url().should('include', '/register');
  });

  it('Should navigate to the sign in page if user is not authenticated', () => {
    cy.visit('/');
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const user = data.auth.generateUser();
    cy.visit('/sign-in');

    $form().submit();
    $form().contains(/email.*required/i).should('be.visible');
    $form().contains(/password.*required/i).should('be.visible');

    $email().type(user.email);
    $password().type(user.password);
    $form().contains(/email.*required/i).should('not.exist');
    $form().contains(/password.*required/i).should('not.exist');
  });

  it('Should display error if authentication fails', () => {
    cy['auth/registerUser']()
      .then(user => {
        const nonExistingUser = data.auth.generateUser();
        cy.visit('/sign-in');

        $email().type(nonExistingUser.email);
        $password().type(nonExistingUser.password);
        $form().submit();
        $form().contains(/invalid.*credentials/i).should('be.visible');

        $email().clear().type(user.email);
        $password().type(nonExistingUser.password);
        $form().submit();
        $form().contains(/invalid.*credentials/i).should('be.visible');
      });
  });

  it('Should sign in the user', () => {
    cy['auth/registerUser']()
      .then(user => {
        cy.visit('/?test=10');

        $email().type(user.email);
        $password().type(user.password);
        $submitButton().click();

        $notifications().contains(new RegExp(`signed.*in.*${user.email}`, 'i')).should('be.visible');
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
