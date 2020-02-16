const { createUser } = require('../../data');

describe('Profile', () => {
  const $generalForm = () => cy.get('[data-qa="generalForm"]');
  const $generalFormSubmit = () => cy.get('[data-qa="generalForm.submit"]');
  const $email = () => cy.get('[data-qa="generalForm.email"]');
  const $fullName = () => cy.get('[data-qa="generalForm.fullName"]');
  const $profileImageUrl = () => cy.get('[data-qa="generalForm.profileImageUrl"]');

  const $passwordForm = () => cy.get('[data-qa="passwordForm"]');
  const $passwordFormSubmit = () => cy.get('[data-qa="passwordForm.submit"]');
  const $password = () => cy.get('[data-qa="passwordForm.password"]');
  const $newPassword = () => cy.get('[data-qa="passwordForm.newPassword"]');
  const $newPasswordConfirm = () => cy.get('[data-qa="passwordForm.newPasswordConfirm"]');

  it('Should be accessible from menus', () => {
    cy.registerAndSignInUser();

    cy.visit('/');
    cy.get('[data-qa="navbar.profile.activator"]').click();
    cy.get('[data-qa="navbar.profile.items.profile.link"]').click();
    cy.url().should('include', '/profile');

    cy.visit('/');
    cy.get('[data-qa="navbar.sidebarToggle"]').click();
    cy.get('[data-qa="sidebar.profile.link"]').click();
    cy.url().should('include', '/profile');
    cy.get('[data-qa="navbar.sidebarToggle"]').click();
  });

  it('Should display the users profile information', () => {
    const user = createUser();
    const { email, fullName, profileImageUrl } = user;
    cy.registerAndSignInUser(user);
    cy.visit('/profile');

    $email().should('have.value', email);
    $email().should('be.disabled');
    $fullName().should('have.value', fullName);
    $profileImageUrl().should('have.value', profileImageUrl);
    $password().should('be.empty');
    $newPassword().should('be.empty');
    $newPasswordConfirm().should('be.empty');
  });

  it('Should update the users general profile information', () => {
    const user = createUser();
    const update = createUser();
    cy.registerAndSignInUser(user);
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
    cy.get('[data-qa="notifications"]').contains(/profile.*updated/i).should('be.visible');
  });

  it('Should display profile info in the navbar', () => {
    const user = createUser();
    cy.registerAndSignInUser(user);
    cy.visit('/profile');

    const $activator = () => cy.get('[data-qa="navbar.profile.activator"]');
    const $activatorIcon = () => cy.get('[data-qa="navbar.profile.activator.icon"]');
    const $activatorImage = () => cy.get('[data-qa="navbar.profile.activator.image"]');
    const $profileIcon = () => cy.get('[data-qa="navbar.profile.items.profile.icon"]');
    const $profileImage = () => cy.get('[data-qa="navbar.profile.items.profile.image"]');
    const $profileEmail = () => cy.get('[data-qa="navbar.profile.items.profile.email"]');
    const $profileFullName = () => cy.get('[data-qa="navbar.profile.items.profile.fullName"]');

    $activator().click();
    $activatorIcon().should('not.be.visible');
    $activatorImage().invoke('attr', 'src').should('eq', user.profileImageUrl);
    $profileIcon().should('not.be.visible');
    $profileImage().invoke('attr', 'src').should('eq', user.profileImageUrl);
    $profileEmail().should('have.text', user.email);
    $profileFullName().should('have.text', user.fullName);

    $fullName().clear();
    $profileImageUrl().clear();
    $activatorIcon().should('be.visible');
    $activatorImage().should('not.be.visible');
    $profileIcon().should('be.visible');
    $profileImage().should('not.be.visible');
    $profileFullName().should('not.be.visible');
  });

  it('Should validate the users old password and the form before password update', () => {
    const user = createUser();
    const update = createUser();
    cy.registerAndSignInUser(user);
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

  it('Should update the users password', () => {
    const user = createUser();
    const update = createUser();
    cy.registerAndSignInUser(user);
    cy.visit('/profile');

    $password().clear().type(user.password);
    $newPassword().clear().type(update.password);
    $newPasswordConfirm().clear().type(update.password);
    $passwordForm().submit();
    $passwordForm().contains(/password.*invalid/i).should('not.be.visible');
    cy.get('[data-qa="notifications"]').contains(/password.*updated/i).should('be.visible');

    cy.signOutUser();
    cy.visit('/sign-in');

    const $signInForm = () => cy.get('[data-qa="signInForm"]');
    const $signInEmail = () => cy.get('[data-qa="signInForm.email"]');
    const $signInPassword = () => cy.get('[data-qa="signInForm.password"]');

    $signInEmail().type(user.email);
    $signInPassword().type(user.password);
    $signInForm().submit();
    $signInForm().contains(/invalid.*credentials/i).should('be.visible');

    $signInPassword().clear().type(update.password);
    $signInForm().submit();
    cy.url().should('not.include', '/sign-in');
  });
});
