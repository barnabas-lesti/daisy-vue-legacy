const data = require('../../data');

describe('Auth / Profile', () => {
  it('Should be accessible from menus', () => {
    cy['auth/signIn']()
      .then(() => {
        cy.visit('/');
        cy.get('[data-qa="navbar.profile.activator"]').click();
        cy.get('[data-qa="navbar.profile.items.profile.link"]').click();
        cy.url().should('include', '/profile');

        cy.visit('/');
        cy.get('[data-qa="navbar.sidebarToggle"]').click();
        cy.get('[data-qa="sidebar.profile.link"]').click();
        cy.url().should('include', '/profile');
      });
  });

  it('Should display the users profile information', () => {
    cy['auth/signIn']()
      .then(user => {
        cy.visit('/profile');

        cy.get('[data-qa="views.profile.generalForm.email"]').should('have.value', user.email);
        cy.get('[data-qa="views.profile.generalForm.email"]').should('be.disabled');
        cy.get('[data-qa="views.profile.generalForm.fullName"]').should('have.value', user.fullName);
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').should('have.value', user.profileImageUrl);
        cy.get('[data-qa="views.profile.passwordForm.password"]').should('be.empty');
        cy.get('[data-qa="views.profile.passwordForm.newPassword"]').should('be.empty');
        cy.get('[data-qa="views.profile.passwordForm.newPasswordConfirm"]').should('be.empty');
      });
  });

  it('Should update the users general profile information', () => {
    cy['auth/signIn']()
      .then(() => {
        const update = data.generateUser();
        cy.visit('/profile');

        cy.get('[data-qa="views.profile.generalForm.fullName"]').clear();
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').clear();
        cy.get('[data-qa="views.profile.generalForm.submit"]').click();
        cy.get('[data-qa="views.profile.generalForm.fullName"]').should('be.empty');
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').should('be.empty');

        cy.get('[data-qa="views.profile.generalForm.fullName"]').clear().type(update.fullName);
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').clear().type(update.profileImageUrl);
        cy.get('[data-qa="views.profile.generalForm"]').submit();
        cy.get('[data-qa="views.profile.generalForm.fullName"]').should('have.value', update.fullName);
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').should('have.value', update.profileImageUrl);
        cy.get('[data-qa="notifications"]').contains(/profile.*updated/i).should('be.visible');
      });
  });

  it('Should display profile info in the navbar', () => {
    cy['auth/signIn']()
      .then(user => {
        cy.visit('/profile');

        cy.get('[data-qa="navbar.profile.activator"]').click();
        cy.get('[data-qa="navbar.profile.activator.icon"]').should('not.be.visible');
        cy.get('[data-qa="navbar.profile.activator.image"]').invoke('attr', 'src').should('eq', user.profileImageUrl);
        cy.get('[data-qa="navbar.profile.items.profile.icon"]').should('not.be.visible');
        cy.get('[data-qa="navbar.profile.items.profile.image"]').invoke('attr', 'src').should('eq', user.profileImageUrl);
        cy.get('[data-qa="navbar.profile.items.profile.email"]').should('have.text', user.email);
        cy.get('[data-qa="navbar.profile.items.profile.fullName"]').should('have.text', user.fullName);

        cy.get('[data-qa="views.profile.generalForm.fullName"]').clear();
        cy.get('[data-qa="views.profile.generalForm.profileImageUrl"]').clear();
        cy.get('[data-qa="navbar.profile.activator.icon"]').should('be.visible');
        cy.get('[data-qa="navbar.profile.activator.image"]').should('not.be.visible');
        cy.get('[data-qa="navbar.profile.items.profile.icon"]').should('be.visible');
        cy.get('[data-qa="navbar.profile.items.profile.image"]').should('not.be.visible');
        cy.get('[data-qa="navbar.profile.items.profile.fullName"]').should('not.be.visible');
      });
  });

  it('Should validate the users old password and the form before password update', () => {
    cy['auth/signIn']()
      .then(user => {
        const update = data.generateUser();
        cy.visit('/profile');

        cy.get('[data-qa="views.profile.passwordForm.submit"]').click();
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/current.*password.*required/i).should('be.visible');
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/new.*password.*required/i).should('be.visible');
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/new.*password.*confirm.*required/i).should('be.visible');

        cy.get('[data-qa="views.profile.passwordForm.newPassword"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm.newPasswordConfirm"]').clear().type(user.password);
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/password.*must.*match/i).should('be.visible');

        cy.get('[data-qa="views.profile.passwordForm.password"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm.newPassword"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm.newPasswordConfirm"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm"]').submit();
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/password.*invalid/i).should('be.visible');
      });
  });

  it('Should update the users password', () => {
    cy['auth/signIn']()
      .then(user => {
        const update = data.generateUser();
        cy.visit('/profile');

        cy.get('[data-qa="views.profile.passwordForm.password"]').clear().type(user.password);
        cy.get('[data-qa="views.profile.passwordForm.newPassword"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm.newPasswordConfirm"]').clear().type(update.password);
        cy.get('[data-qa="views.profile.passwordForm"]').submit();
        cy.get('[data-qa="views.profile.passwordForm"]').contains(/password.*invalid/i).should('not.be.visible');
        cy.get('[data-qa="notifications"]').contains(/password.*updated/i).should('be.visible');

        cy['auth/signOut']();
        cy.visit('/sign-in');

        cy.get('[data-qa="views.signIn.form.email"]').type(user.email);
        cy.get('[data-qa="views.signIn.form.password"]').type(user.password);
        cy.get('[data-qa="views.signIn.form"]').submit();
        cy.get('[data-qa="views.signIn.form"]').contains(/invalid.*credentials/i).should('be.visible');
        cy.get('[data-qa="views.signIn.form.password"]').clear().type(update.password);
        cy.get('[data-qa="views.signIn.form"]').submit();
        cy.url().should('not.include', '/sign-in');
      });
  });
});
