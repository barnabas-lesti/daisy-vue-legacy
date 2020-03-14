import mocks from '../../support/mocks';
import stubs from '../../support/stubs';

describe('Functional / Sign in', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy.visit('/sign-in');
    cy.title()
      .should('eq', 'Sign in | Daisy');
    cy.get('.sign-in__title')
      .contains('Sign in')
      .should('be.visible');
  });

  it('Register page should be accessible from the page', () => {
    cy.visit('/sign-in');
    cy.get('.sign-in-form__register-link')
      .click();
    cy.url()
      .should('include', '/register');
  });

  it('App should navigate to the sign in page if user has no auth. tokens stored', () => {
    cy.visit('/');
    cy.url()
      .should('include', '/sign-in');
  });

  it('Page should display a "session expired" error if auth. tokens are invalid', () => {
    cy.server()
      .route({ method: 'GET', url: '/api/auth/profile', status: 401, response: { error: 'UNAUTHORIZED' } });
    localStorage.setItem('auth/authHeader', '"ah"');
    cy.visit('/');

    cy.get('.sign-in-form')
      .contains(/session.*expired/i).should('be.visible');
  });

  it('Page should navigate to the original page if token authentication is successful', () => {
    stubs['auth/user']();
    localStorage.setItem('auth/authHeader', JSON.stringify(mocks.authHeader()));
    cy.visit('/?test=10');
    cy.url()
      .should('not.include', '/sign-in');
    cy.url()
      .should('include', '?test=10');
  });

  it('Form should be validated before submit', () => {
    const { email, password } = mocks.getUser();
    cy.visit('/sign-in');

    cy.get('.sign-in-form')
      .submit();
    cy.get('.sign-in-form')
      .contains(/email.*required/i)
      .should('be.visible');
    cy.get('.sign-in-form')
      .contains(/password.*required/i)
      .should('be.visible');

    cy.get('.sign-in-form input[name="email"]')
      .type(email);
    cy.get('.sign-in-form input[name="password"]')
      .type(password);
    cy.get('.sign-in-form')
      .contains(/email.*required/i)
      .should('not.be.visible');
    cy.get('.sign-in-form')
      .contains(/password.*required/i)
      .should('not.be.visible');
  });

  it('Should display "invalid credentials" error if user is not found', () => {
    const user = mocks.getUser();
    cy.visit('/sign-in');

    cy.server()
      .route({ method: 'POST', url: '/api/auth/sign-in', status: 404, response: { error: 'NOT_FOUND' } });
    cy.get('.sign-in-form input[name="email"]')
      .type(user.email);
    cy.get('.sign-in-form input[name="password"]')
      .type(user.password);
    cy.get('.sign-in-form button[type="submit"]')
      .click();
    cy.get('.sign-in-form')
      .contains(/invalid.*credentials/i)
      .should('be.visible');
  });

  it('Should display "invalid credentials" error if credentials are invalid', () => {
    const user = mocks.getUser();
    cy.server()
      .route({ method: 'POST', url: '/api/auth/sign-in', status: 401, response: { error: 'INVALID_CREDENTIALS' } });
    cy.visit('/sign-in');

    cy.get('.sign-in-form input[name="email"]')
      .type(user.email);
    cy.get('.sign-in-form input[name="password"]')
      .type(user.password);
    cy.get('.sign-in-form')
      .submit();

    cy.get('.sign-in-form')
      .contains(/invalid.*credentials/i)
      .should('be.visible');
  });

  it('Should sign in the user', () => {
    const user = mocks.getUser();
    const authHeader = mocks.authHeader();
    cy.visit('/sign-in');

    cy.server()
      .route({ method: 'POST', url: '/api/auth/sign-in', status: 200, response: { user, authHeader }, delay: 64 });
    cy.get('.sign-in-form input[name="email"]')
      .type(user.email);
    cy.get('.sign-in-form input[name="password"]')
      .type(user.password);
    cy.get('.sign-in-form button[type="submit"]')
      .click()
      .should('have.class', 'v-btn--loading');

    cy.get('.layout-notifications')
      .contains(new RegExp(`signed.*in.*${user.email}`, 'i'))
      .should('be.visible');
    cy.url()
      .should('not.include', '/sign-in');
    cy.window()
      .then(window => {
        expect(JSON.parse(window.localStorage.getItem('auth/authHeader'))).to.equal(authHeader);
      });
  });
});
