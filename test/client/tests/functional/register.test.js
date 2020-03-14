import mocks from '../../support/mocks';

describe('Functional / Register', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy.visit('/register');
    cy.title()
      .should('eq', 'Register | Daisy');
    cy.get('.register__title')
      .contains('Register')
      .should('be.visible');
  });

  it('Sign in page should be accessible from the page', () => {
    cy.visit('/register');
    cy.get('.register-form__sign-in-link')
      .click();
    cy.url()
      .should('include', '/sign-in');
  });

  it('Form should be validated before submit', () => {
    const { email, password } = mocks.getUser();
    const { password: differentPassword } = mocks.getUser();
    cy.visit('/register');

    cy.get('.register-form')
      .submit();
    cy.get('.register-form')
      .contains(/email.*required/i)
      .should('be.visible');
    cy.get('.register-form')
      .contains(/password.*required/i)
      .should('be.visible');
    cy.get('.register-form')
      .contains(/password.*confirm.*required/i)
      .should('be.visible');

    cy.get('.register-form input[name="email"]')
      .type(email);
    cy.get('.register-form input[name="password"]')
      .type(password);
    cy.get('.register-form input[name="passwordConfirm"]')
      .type(differentPassword);
    cy.get('.register-form')
      .contains(/email.*required/i)
      .should('not.be.visible');
    cy.get('.register-form')
      .contains(/password.*required/i)
      .should('not.be.visible');
    cy.get('.register-form')
      .contains(/password.*confirm.*required/i)
      .should('not.be.visible');
    cy.get('.register-form')
      .contains(/password.*match/i)
      .should('be.visible');

    cy.get('.register-form input[name="passwordConfirm"]')
      .clear()
      .type(password);
    cy.get('.register-form')
      .contains(/password.*match/i)
      .should('not.be.visible');
  });

  it('Should not allow registering already existing user', () => {
    const existingUser = mocks.getUser();
    cy.visit('/register');

    cy.server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 400, response: { error: 'ALREADY_EXISTS' } });
    cy.get('.register-form input[name="email"]')
      .type(existingUser.email);
    cy.get('.register-form input[name="password"]')
      .type(existingUser.password);
    cy.get('.register-form input[name="passwordConfirm"]')
      .type(existingUser.password);
    cy.get('.register-form')
      .submit();

    cy.get('.register-form')
      .contains(/email.*exists/i)
      .should('be.visible');
  });

  it('Should register a new user', () => {
    const user = mocks.getUser();
    cy.visit('/register');

    cy.server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 200, response: user, delay: 64 });
    cy.get('.register-form input[name="email"]')
      .type(user.email);
    cy.get('.register-form input[name="password"]')
      .type(user.password);
    cy.get('.register-form input[name="passwordConfirm"]')
      .type(user.password);
    cy.get('.register-form button[type="submit"]')
      .click()
      .should('have.class', 'v-btn--loading');

    cy.get('.layout-notifications')
      .contains(/registration.*successful/i)
      .should('be.visible');
    cy.url()
      .should('include', '/sign-in');
    cy.get('.sign-in-form input[name="email"]')
      .should('have.value', user.email);
  });
});
