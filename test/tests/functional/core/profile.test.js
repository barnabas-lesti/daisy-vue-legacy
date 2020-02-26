import mocks from '../../../support/mocks';

const user = mocks.user();

describe('Functional / Core / Profile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should be accessible from menus', () => {
    cy['core/signIn'](user)
      .visit('/');

    cy.get('.navbar-profile-menu__activator')
      .click();
    cy.get('.navbar-profile-menu__item--profile')
      .click();
    cy.url()
      .should('include', '/profile');

    cy['core/signIn'](user)
      .visit('/');
    cy.get('.navbar__toggle')
      .click();
    cy.get('.sidebar-list-item--profile')
      .click();

    cy.url()
      .should('include', '/profile');
  });

  it('Should display the users profile information', () => {
    cy['core/signIn'](user)
      .visit('/profile');

    cy.get('input[name="email"]')
      .should('have.value', user.email)
      .should('be.disabled');
    cy.get('input[name="fullName"]')
      .should('have.value', user.fullName);
    cy.get('input[name="profileImageUrl"]')
      .should('have.value', user.profileImageUrl);
    cy.get('input[name="password"]')
      .should('be.empty');
    cy.get('input[name="newPassword"]')
      .should('be.empty');
    cy.get('input[name="newPasswordConfirm"]')
      .should('be.empty');
  });

  it('Should update the users general profile information', () => {
    const { fullName, profileImageUrl } = mocks.user();
    const updatedUser = { ...user, profileImageUrl, fullName };
    cy['core/signIn'](user)
      .visit('/profile');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile', status: 200, response: updatedUser, delay: 64 });
    cy.get('input[name="fullName"]').as('fullName')
      .clear().type(updatedUser.fullName);
    cy.get('input[name="profileImageUrl"]').as('profileImageUrl')
      .clear().type(updatedUser.profileImageUrl);
    cy.get('.profile__general__submit').as('submit')
      .click()
      .should('have.class', 'v-btn--loading');

    cy.get('.notifications')
      .contains(/profile.*updated/i).should('be.visible');
    cy.get('input[name="email"]')
      .should('have.value', user.email);
    cy.get('@fullName')
      .should('have.value', updatedUser.fullName);
    cy.get('@profileImageUrl')
      .should('have.value', updatedUser.profileImageUrl);
  });

  it('Should display profile info in the navbar', () => {
    cy['core/signIn'](user)
      .visit('/profile');

    cy.get('.navbar-profile-menu__activator').as('activator')
      .click();
    cy.get('.navbar-profile-menu__activator__icon').as('activatorIcon')
      .should('not.be.visible');
    cy.get('.navbar-profile-menu__activator__image').as('activatorImage')
      .invoke('attr', 'src').should('eq', user.profileImageUrl);
    cy.get('.navbar-profile-menu__item--profile .navbar-profile-menu__item__icon').as('profileIcon')
      .should('not.be.visible');
    cy.get('.navbar-profile-menu__item--profile .navbar-profile-menu__item__image').as('profileImage')
      .invoke('attr', 'src').should('eq', user.profileImageUrl);
    cy.get('.navbar-profile-menu__item--profile .navbar-profile-menu__item__title').as('fullName')
      .should('have.text', user.fullName);
    cy.get('.navbar-profile-menu__item--profile .navbar-profile-menu__item__subtitle')
      .should('have.text', user.email);

    cy.get('@activator')
      .click();
    cy.get('input[name="fullName"]')
      .clear();
    cy.get('input[name="profileImageUrl"]')
      .clear();

    cy.get('@activator')
      .click();
    cy.get('@activatorIcon')
      .should('be.visible');
    cy.get('@activatorImage')
      .should('not.be.visible');
    cy.get('@profileIcon')
      .should('be.visible');
    cy.get('@profileImage')
      .should('not.be.visible');
    cy.get('@fullName')
      .should('not.be.visible');
  });

  it('Should validate the users old password and the form before password update', () => {
    const update = mocks.user();
    cy['core/signIn'](user)
      .visit('/profile');

    cy.get('.profile__password button[type="submit"]')
      .click();
    cy.get('.profile__password form').as('passwordForm')
      .contains(/current.*password.*required/i).should('be.visible');
    cy.get('@passwordForm')
      .contains(/new.*password.*required/i).should('be.visible');
    cy.get('@passwordForm')
      .contains(/new.*password.*confirm.*required/i).should('be.visible');

    cy.get('input[name="password"]').as('password')
      .type(user.password);
    cy.get('input[name="newPassword"]').as('newPassword')
      .type(update.password);
    cy.get('input[name="newPasswordConfirm"]').as('newPasswordConfirm')
      .type(user.password);
    cy.get('@passwordForm')
      .contains(/current.*password.*required/i).should('not.be.visible');
    cy.get('@passwordForm')
      .contains(/password.*must.*match/i).should('be.visible');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 401, response: { error: 'INVALID_CREDENTIALS' } });
    cy.get('input[name="newPasswordConfirm"]').as('newPasswordConfirm')
      .clear().type(update.password);
    cy.get('@passwordForm')
      .submit();
    cy.get('@passwordForm')
      .contains(/password.*invalid/i).should('be.visible');
  });

  it('Should update the users password', () => {
    const update = mocks.user();
    cy['core/signIn'](user)
      .visit('/profile');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 200, response: '', delay: 64 });
    cy.get('input[name="password"]')
      .type(user.password);
    cy.get('input[name="newPassword"]')
      .type(update.password);
    cy.get('input[name="newPasswordConfirm"]')
      .type(update.password);
    cy.get('.profile__password__submit')
      .click()
      .should('have.class', 'v-btn--loading');

    cy.get('.notifications')
      .contains(/password.*updated/i).should('be.visible');
  });
});
