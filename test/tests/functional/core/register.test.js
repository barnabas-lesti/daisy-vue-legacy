const Mock = require('../../../support/mock');
const stubs = require('../../../support/stubs');

describe('Functional / Core / Register', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Register page should be accessible from the Sign in page', () => {
    cy.visit('/sign-in')
      .get('.sign-in-form__register-link')
      .click();
    cy.url()
      .should('include', '/register');
  });

  it('Form should be validated before submit', () => {
    const { email, password } = new Mock.User();
    const { password: differentPassword } = new Mock.User();

    cy.visit('/register')
      .get('.register-form').as('form')
      .submit();
    cy.get('@form')
      .contains(/email.*required/i).should('be.visible');
    cy.get('@form')
      .contains(/password.*required/i).should('be.visible');
    cy.get('@form')
      .contains(/password.*confirm.*required/i).should('be.visible');

    cy.get('input[name="email"]')
      .type(email);
    cy.get('input[name="password"]')
      .type(password);
    cy.get('input[name="passwordConfirm"]').as('passwordConfirm')
      .type(differentPassword);
    cy.get('@form')
      .contains(/email.*required/i).should('not.be.visible');
    cy.get('@form')
      .contains(/password.*required/i).should('not.be.visible');
    cy.get('@form')
      .contains(/password.*confirm.*required/i).should('not.be.visible');
    cy.get('@form')
      .contains(/password.*match/i).should('be.visible');

    cy.get('@passwordConfirm')
      .clear()
      .type(password);
    cy.get('@form')
      .contains(/password.*match/i).should('not.be.visible');
  });

  it('Should not allow registering already existing user', () => {
    const existingUser = new Mock.User();
    stubs['api/auth/register']['400/alreadyExists']()
      .visit('/register')
      .get('.register-form').as('form');

    cy.get('input[name="email"]')
      .type(existingUser.email);
    cy.get('input[name="password"]')
      .type(existingUser.password);
    cy.get('input[name="passwordConfirm"]')
      .type(existingUser.password);
    cy.get('@form')
      .submit();

    cy.get('@form')
      .contains(/email.*exists/i).should('be.visible');
  });

  it('Should register a new user', () => {
    const user = new Mock.User();
    stubs['api/auth/register']['200/ok'](user)
      .visit('/register');

    cy.get('input[name="email"]')
      .type(user.email);
    cy.get('input[name="password"]')
      .type(user.password);
    cy.get('input[name="passwordConfirm"]')
      .type(user.password);
    cy.get('button[type="submit"]')
      .click();

    cy.get('.notifications')
      .contains(/registration.*successful/i).should('be.visible');
    cy.url()
      .should('include', '/sign-in');
    cy.get('.sign-in-form input[name="email"]')
      .should('have.value', user.email);
  });
});
