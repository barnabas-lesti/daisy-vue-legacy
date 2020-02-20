const data = require('../../data');

const $generalForm = () => cy.get('[data-qa="profile.generalForm"]');
const $generalFormSubmit = () => cy.get('[data-qa="profile.generalForm.submit"]');
const $email = () => cy.get('[data-qa="profile.generalForm.email"]');
const $fullName = () => cy.get('[data-qa="profile.generalForm.fullName"]');
const $profileImageUrl = () => cy.get('[data-qa="profile.generalForm.profileImageUrl"]');

const $passwordForm = () => cy.get('[data-qa="profile.passwordForm"]');
const $passwordFormSubmit = () => cy.get('[data-qa="profile.passwordForm.submit"]');
const $password = () => cy.get('[data-qa="profile.passwordForm.password"]');
const $newPassword = () => cy.get('[data-qa="profile.passwordForm.newPassword"]');
const $newPasswordConfirm = () => cy.get('[data-qa="profile.passwordForm.newPasswordConfirm"]');

const $navbarSidebarToggle = () => cy.get('[data-qa="navbar.sidebarToggle"]');
const $navbarProfileActivator = () => cy.get('[data-qa="navbar.profile.activator"]');
const $navbarProfileActivatorIcon = () => cy.get('[data-qa="navbar.profile.activator.icon"]');
const $navbarProfileActivatorImage = () => cy.get('[data-qa="navbar.profile.activator.image"]');
const $navbarProfileLink = () => cy.get('[data-qa="navbar.profile.items.profile.link"]');
const $navbarProfileLinkIcon = () => cy.get('[data-qa="navbar.profile.items.profile.icon"]');
const $navbarProfileLinkImage = () => cy.get('[data-qa="navbar.profile.items.profile.image"]');
const $navbarProfileLinkEmail = () => cy.get('[data-qa="navbar.profile.items.profile.email"]');
const $navbarProfileLinkFullName = () => cy.get('[data-qa="navbar.profile.items.profile.fullName"]');

const $sidebarProfileLink = () => cy.get('[data-qa="sidebar.profile.link"]');

const $notifications = () => cy.get('[data-qa="notifications"]');

const $signInForm = () => cy.get('[data-qa="signIn.form"]');
const $signInEmail = () => cy.get('[data-qa="signIn.form.email"]');
const $signInPassword = () => cy.get('[data-qa="signIn.form.password"]');

describe('Auth / Profile', () => {
  it('Should be accessible from menus', () => {
    cy['auth/signIn']()
      .then(() => {
        cy.visit('/');
        $navbarProfileActivator().click();
        $navbarProfileLink().click();
        cy.url().should('include', '/profile');

        cy.visit('/');
        $navbarSidebarToggle().click();
        $sidebarProfileLink().click();
        cy.url().should('include', '/profile');
      });
  });

  it('Should display the users profile information', () => {
    cy['auth/signIn']()
      .then(user => {
        cy.visit('/profile');

        $email().should('have.value', user.email);
        $email().should('be.disabled');
        $fullName().should('have.value', user.fullName);
        $profileImageUrl().should('have.value', user.profileImageUrl);
        $password().should('be.empty');
        $newPassword().should('be.empty');
        $newPasswordConfirm().should('be.empty');
      });
  });

  it('Should update the users general profile information', () => {
    cy['auth/signIn']()
      .then(user => {
        const update = data.auth.generateUser();
        cy.visit('/profile');

        $fullName().clear();
        $profileImageUrl().clear();
        $generalFormSubmit().click();
        $fullName().should('be.empty');
        $profileImageUrl().should('be.empty');

        $fullName().clear().type(update.fullName);
        $profileImageUrl().clear().type(update.profileImageUrl);
        $generalForm().submit();
        $fullName().should('have.value', update.fullName);
        $profileImageUrl().should('have.value', update.profileImageUrl);
        $notifications().contains(/profile.*updated/i).should('be.visible');
      });
  });

  it('Should display profile info in the navbar', () => {
    cy['auth/signIn']()
      .then(user => {
        cy.visit('/profile');

        $navbarProfileActivator().click();
        $navbarProfileActivatorIcon().should('not.be.visible');
        $navbarProfileActivatorImage().invoke('attr', 'src').should('eq', user.profileImageUrl);
        $navbarProfileLinkIcon().should('not.be.visible');
        $navbarProfileLinkImage().invoke('attr', 'src').should('eq', user.profileImageUrl);
        $navbarProfileLinkEmail().should('have.text', user.email);
        $navbarProfileLinkFullName().should('have.text', user.fullName);

        $fullName().clear();
        $profileImageUrl().clear();
        $navbarProfileActivatorIcon().should('be.visible');
        $navbarProfileActivatorImage().should('not.be.visible');
        $navbarProfileLinkIcon().should('be.visible');
        $navbarProfileLinkImage().should('not.be.visible');
        $navbarProfileLinkFullName().should('not.be.visible');
      });
  });

  it('Should validate the users old password and the form before password update', () => {
    cy['auth/signIn']()
      .then(user => {
        const update = data.auth.generateUser();
        cy.visit('/profile');

        $passwordFormSubmit().click();
        $passwordForm().contains(/current.*password.*required/i).should('be.visible');
        $passwordForm().contains(/new.*password.*required/i).should('be.visible');
        $passwordForm().contains(/new.*password.*confirm.*required/i).should('be.visible');

        $newPassword().clear().type(update.password);
        $newPasswordConfirm().clear().type(user.password);
        $passwordForm().contains(/password.*must.*match/i).should('be.visible');

        $password().clear().type(update.password);
        $newPassword().clear().type(update.password);
        $newPasswordConfirm().clear().type(update.password);
        $passwordForm().submit();
        $passwordForm().contains(/password.*invalid/i).should('be.visible');
      });
  });

  it('Should update the users password', () => {
    cy['auth/signIn']()
      .then(user => {
        const update = data.auth.generateUser();
        cy.visit('/profile');

        $password().clear().type(user.password);
        $newPassword().clear().type(update.password);
        $newPasswordConfirm().clear().type(update.password);
        $passwordForm().submit();
        $passwordForm().contains(/password.*invalid/i).should('not.be.visible');
        $notifications().contains(/password.*updated/i).should('be.visible');

        cy['auth/signOut']();
        cy.visit('/sign-in');

        $signInEmail().type(user.email);
        $signInPassword().type(user.password);
        $signInForm().submit();
        $signInForm().contains(/invalid.*credentials/i).should('be.visible');
        $signInPassword().clear().type(update.password);
        $signInForm().submit();
        cy.url().should('not.include', '/sign-in');
      });
  });
});
