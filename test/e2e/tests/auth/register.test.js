const data = require('../../data');

describe('Auth / Register', () => {
  it('Should have a link to the sign in page', () => {
    cy.visit('/register');
    cy.get('[data-qa="views.register.form.signInLink"]').click();
    cy.url().should('include', '/sign-in');
  });

  it('Should validate the fields before submit', () => {
    const { email, password } = data.generateUser();
    const notMatchingPassword = data.faker.internet.password(12);

    cy.visit('/register');

    cy.get('[data-qa="views.register.form"]').submit();
    cy.get('[data-qa="views.register.form"]').contains(/email.*required/i).should('be.visible');
    cy.get('[data-qa="views.register.form"]').contains(/password.*required/i).should('be.visible');
    cy.get('[data-qa="views.register.form"]').contains(/password.*confirm.*required/i).should('be.visible');

    cy.get('[data-qa="views.register.form.email"]').type(email);
    cy.get('[data-qa="views.register.form.password"]').type(password);
    cy.get('[data-qa="views.register.form.passwordConfirm"]').type(notMatchingPassword);

    cy.get('[data-qa="views.register.form"]').contains(/email.*required/i).should('not.exist');
    cy.get('[data-qa="views.register.form"]').contains(/password.*required/i).should('not.exist');
    cy.get('[data-qa="views.register.form"]').contains(/password.*confirm.*required/i).should('not.exist');
    cy.get('[data-qa="views.register.form"]').contains(/password.*match/i).should('be.visible');

    cy.get('[data-qa="views.register.form.passwordConfirm"]').clear().type(password);
    cy.get('[data-qa="views.register.form"]').contains(/password.*match/i).should('not.exist');
  });

  it('Should not allow registration with already registered email', () => {
    cy['auth/registerUser']()
      .then(user => {
        cy.visit('/register');

        cy.get('[data-qa="views.register.form.email"]').type(user.email);
        cy.get('[data-qa="views.register.form.password"]').type(user.password);
        cy.get('[data-qa="views.register.form.passwordConfirm"]').type(user.password);
        cy.get('[data-qa="views.register.form"]').submit();

        cy.get('[data-qa="views.register.form"]').contains(/email.*exists/i).should('be.visible');
      });
  });

  it('Should register a new user', () => {
    const user = data.generateUser();

    cy.visit('/register');

    cy.get('[data-qa="views.register.form.email"]').type(user.email);
    cy.get('[data-qa="views.register.form.password"]').type(user.password);
    cy.get('[data-qa="views.register.form.passwordConfirm"]').type(user.password);
    cy.get('[data-qa="views.register.form.submit"]').click();

    cy.get('[data-qa="notifications"]').contains(/registration.*successful/i).should('be.visible');
    cy.url().should('include', '/sign-in');
    cy.get('[data-qa="views.signIn.form.email"]').should('have.value', user.email);
  });
});
