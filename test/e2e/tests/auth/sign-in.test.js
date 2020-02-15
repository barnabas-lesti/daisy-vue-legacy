const { createUser } = require('../../data');

describe('Sign in', () => {
  const $signInLink = () => cy.get('[data-qa="signInForm.registerLink"]');
  const $form = () => cy.get('[data-qa="signInForm"]');
  const $email = () => $form().get('[data-qa="signInForm.email"]');
  const $password = () => $form().get('[data-qa="signInForm.password"]');
  const $submit = () => $form().get('[data-qa="signInForm.submit"]');

  it('Should have a link to the registration page', () => {
    cy.visit('/sign-in');
    $signInLink().click();
    cy.url().should('include', '/register');
  });

  it('Should navigate to the sign in page if user is not authenticated', () => {
    cy.visit('/');
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const { email, password } = createUser();

    cy.visit('/sign-in');

    $form().submit();
    $form().contains(/email.*required/i).should('be.visible');
    $form().contains(/password.*required/i).should('be.visible');

    $email().type(email);
    $password().type(password);

    $form().contains(/email.*required/i).should('not.exist');
    $form().contains(/password.*required/i).should('not.exist');
  });

  it('Should display error if authentication fails', () => {
    const existingUser = createUser();
    const nonExistingUser = createUser();
    cy.registerUser(existingUser);

    cy.visit('/sign-in');

    $email().type(nonExistingUser.email);
    $password().type(nonExistingUser.password);
    $form().submit();
    $form().contains(/invalid.*credentials/i).should('be.visible');

    $email().clear().type(existingUser.email);
    $password().type(nonExistingUser.password);
    $form().submit();
    $form().contains(/invalid.*credentials/i).should('be.visible');
  });

  it('Should sign in the user', () => {
    const user = createUser();
    const { email, password } = user;
    cy.registerUser(user);

    cy.visit('/?test=10');

    $email().type(email);
    $password().type(password);
    $submit().click();

    cy.url().should('not.include', '/sign-in');
    cy.url().should('include', '?test=10');
  });

  it('Should authenticate the user if tokens are set', () => {
    cy.registerAndSignInUser();

    cy.visit('/?test=10');
    cy.url().should('not.include', '/sign-in');
    cy.url().should('include', '?test=10');
  });
});
