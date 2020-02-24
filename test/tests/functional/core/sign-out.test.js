describe('Functional / Core / Sign out', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should sign out the user', () => {
    cy['core/signIn']()
      .visit('/');

    cy.get('.navbar-profile-menu__activator')
      .click();
    cy.get('.navbar-profile-menu__item--sign-out')
      .click();

    cy.url()
      .should('include', '/sign-in');

    cy.visit('/')
      .url()
      .should('include', '/sign-in');
  });
});
