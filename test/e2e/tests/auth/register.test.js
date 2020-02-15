const { faker, createUser } = require('../../data');

describe('Register', () => {
  const $registerLink = () => cy.get('[data-qa="registerForm.signInLink"]');
  const $form = () => cy.get('[data-qa="registerForm"]');
  const $email = () => $form().get('[data-qa="registerForm.email"]');
  const $password = () => $form().get('[data-qa="registerForm.password"]');
  const $passwordConfirm = () => $form().get('[data-qa="registerForm.passwordConfirm"]');
  const $submit = () => $form().get('[data-qa="registerForm.submit"]');

  it('Should have a link to the sign in page', () => {
    cy.visit('/register');
    $registerLink().click();
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const { email, password } = createUser();
    const notMatchingPassword = faker.internet.password(12);

    cy.visit('/register');

    $form().submit();
    $form().contains(/email.*required/i).should('be.visible');
    $form().contains(/password.*required/i).should('be.visible');
    $form().contains(/password.*confirm.*required/i).should('be.visible');

    $email().type(email);
    $password().type(password);
    $passwordConfirm().type(notMatchingPassword);

    $form().contains(/email.*required/i).should('not.exist');
    $form().contains(/password.*required/i).should('not.exist');
    $form().contains(/password.*confirm.*required/i).should('not.exist');
    $form().contains(/password.*match/i).should('be.visible');

    $passwordConfirm().clear().type(password);
    $form().contains(/password.*match/i).should('not.exist');
  });

  it('Should not allow registration with already registered email', () => {
    const existingUser = createUser();
    const { email, password } = existingUser;
    cy.registerUser(existingUser);

    cy.visit('/register');

    $email().type(email);
    $password().type(password);
    $passwordConfirm().type(password);
    $form().submit();

    $form().contains(/email.*exists/i).should('be.visible');
  });

  it('Should register a new user', () => {
    const { email, password } = createUser();

    cy.visit('/register');

    $email().type(email);
    $password().type(password);
    $passwordConfirm().type(password);
    $submit().click();

    cy.url().should('include', '/sign-in');

    const $signInForm = () => cy.get('[data-qa="signInForm"]');
    $signInForm().get('[data-qa="signInForm.email"]').should('have.value', email);
  });
});
