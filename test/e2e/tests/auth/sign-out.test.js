const $navbarLink = () => cy.get('[data-qa="navbar.profile.activator"]');
const $signOutLink = () => cy.get('[data-qa="navbar.profile.items.signOut.link"]');

describe('Auth / Sign out', () => {
  it('Should sign out the user', () => {
    cy['auth/signIn']()
      .then(() => {
        cy.visit('/');

        $navbarLink().click();
        $signOutLink().click();

        cy.visit('/');
        cy.url().should('include', '/sign-in');
      });
  });
});
