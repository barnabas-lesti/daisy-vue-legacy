const data = require('../../data');

const $form = () => cy.get('[data-qa="register.form"]');
const $email = () => $form().get('[data-qa="register.form.email"]');
const $password = () => $form().get('[data-qa="register.form.password"]');
const $passwordConfirm = () => $form().get('[data-qa="register.form.passwordConfirm"]');
const $submitButton = () => $form().get('[data-qa="register.form.submit"]');
const $signInLink = () => cy.get('[data-qa="register.form.signInLink"]');
const $notifications = () => cy.get('[data-qa="notifications"]');
const $signInFormEmail = () => cy.get('[data-qa="signIn.form.email"]');

describe('Auth / Register', () => {
  it('Should have a link to the sign in page', () => {
    cy.visit('/register');
    $signInLink().click();
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const { email, password } = data.auth.generateUser();
    const notMatchingPassword = data.faker.internet.password(12);

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
    cy['auth/registerUser']()
      .then(user => {
        cy.visit('/register');

        $email().type(user.email);
        $password().type(user.password);
        $passwordConfirm().type(user.password);
        $form().submit();

        $form().contains(/email.*exists/i).should('be.visible');
      });
  });

  it('Should register a new user', () => {
    const user = data.auth.generateUser();

    cy.visit('/register');

    $email().type(user.email);
    $password().type(user.password);
    $passwordConfirm().type(user.password);
    $submitButton().click();

    $notifications().contains(/registration.*successful/i).should('be.visible');
    cy.url().should('include', '/sign-in');
    $signInFormEmail().should('have.value', user.email);
  });
});
