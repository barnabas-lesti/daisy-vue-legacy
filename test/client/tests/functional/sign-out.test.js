describe('Functional / Sign out', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should sign out the user', () => {
    cy['auth/signIn']()
      .visit('/');

    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__item--sign-out')
      .click();

    cy.url()
      .should('include', '/sign-in');

    cy.visit('/')
      .url()
      .should('include', '/sign-in');
  });
});
