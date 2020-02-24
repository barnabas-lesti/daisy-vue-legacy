import { mocks } from '../../../support';

describe('Functional / Core / Register', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Sign in page should be accessible from the page', () => {
    cy.visit('/register');
    cy.get('.register-form__sign-in-link')
      .click();
    cy.url()
      .should('include', '/sign-in');
  });

  it('Form should be validated before submit', () => {
    const { email, password } = mocks.user();
    const { password: differentPassword } = mocks.user();
    cy.visit('/register');

    cy.get('.register-form').as('form')
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
    const existingUser = mocks.user();
    cy.visit('/register');

    cy.server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 400, response: { error: 'ALREADY_EXISTS' } });
    cy.get('input[name="email"]')
      .type(existingUser.email);
    cy.get('input[name="password"]')
      .type(existingUser.password);
    cy.get('input[name="passwordConfirm"]')
      .type(existingUser.password);
    cy.get('.register-form').as('form')
      .submit();

    cy.get('@form')
      .contains(/email.*exists/i).should('be.visible');
  });

  it('Should register a new user', () => {
    const user = mocks.user();
    cy.visit('/register');

    cy.server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 200, response: user });
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
