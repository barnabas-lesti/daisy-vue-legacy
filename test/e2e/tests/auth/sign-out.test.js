describe('Sign out', () => {
  it('Should sign out the user', () => {
    cy.registerAndSignInUser();
    cy.visit('/');
    cy.get('[data-qa="navbar.profile.activator"]').click();
    cy.get('[data-qa="navbar.profile.items.signOut.link"]').click();

    cy.visit('/');
    cy.url().should('include', '/sign-in');
  });
});
