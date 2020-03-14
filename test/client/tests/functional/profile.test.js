import mocks from '../../support/mocks';

const user = mocks.getUser();

describe('Functional / Profile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy['auth/signIn'](user)
      .visit('/profile');
    cy.title()
      .should('eq', 'Profile | Daisy');
    cy.get('.layout-navbar__title')
      .contains('Profile')
      .should('be.visible');
  });

  it('Should be accessible from menus', () => {
    cy['auth/signIn'](user)
      .visit('/');

    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__item--profile')
      .click();
    cy.url()
      .should('include', '/profile');

    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--profile')
      .click();
    cy.url()
      .should('include', '/profile');
  });

  it('Should display the users profile information', () => {
    cy['auth/signIn'](user)
      .visit('/profile');

    cy.get('.profile__general input[name="email"]')
      .should('have.value', user.email)
      .should('be.disabled');
    cy.get('.profile__general input[name="fullName"]')
      .should('have.value', user.fullName);
    cy.get('.profile__general input[name="profileImageUrl"]')
      .should('have.value', user.profileImageUrl);
    cy.get('.profile__password input[name="password"]')
      .should('be.empty');
    cy.get('.profile__password input[name="newPassword"]')
      .should('be.empty');
    cy.get('.profile__password input[name="newPasswordConfirm"]')
      .should('be.empty');
  });

  it('Should update the users general profile information', () => {
    const { fullName, profileImageUrl } = mocks.getUser();
    const updatedUser = { ...user, profileImageUrl, fullName };
    cy['auth/signIn'](user)
      .visit('/profile');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile', status: 200, response: updatedUser, delay: 64 });
    cy.get('.profile__general input[name="fullName"]')
      .clear().type(updatedUser.fullName);
    cy.get('.profile__general input[name="profileImageUrl"]')
      .clear().type(updatedUser.profileImageUrl);
    cy.get('.profile__general__submit')
      .click()
      .should('be.disabled');

    cy.get('.layout-notifications')
      .contains(/profile.*updated/i).should('be.visible');
    cy.get('.profile__general input[name="email"]')
      .should('have.value', user.email);
    cy.get('.profile__general input[name="fullName"]')
      .should('have.value', updatedUser.fullName);
    cy.get('.profile__general input[name="profileImageUrl"]')
      .should('have.value', updatedUser.profileImageUrl);
  });

  it('Should display profile info in the navbar', () => {
    cy['auth/signIn'](user)
      .visit('/profile');

    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__activator__icon')
      .should('not.be.visible');
    cy.get('.layout-navbar-profile-menu__activator__image')
      .invoke('attr', 'src')
      .should('eq', user.profileImageUrl);
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__icon')
      .should('not.be.visible');
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__image')
      .invoke('attr', 'src').should('eq', user.profileImageUrl);
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__title')
      .should('have.text', user.fullName);
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__subtitle')
      .should('have.text', user.email);

    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.profile__general input[name="fullName"]')
      .clear();
    cy.get('.profile__general input[name="profileImageUrl"]')
      .clear();

    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__activator__icon')
      .should('be.visible');
    cy.get('.layout-navbar-profile-menu__activator__image')
      .should('not.be.visible');
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__icon')
      .should('be.visible');
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__image')
      .should('not.be.visible');
    cy.get('.layout-navbar-profile-menu__item--profile .layout-navbar-profile-menu__item__title')
      .should('not.be.visible');
  });

  it('Should validate the users old password and the form before password update', () => {
    const update = mocks.getUser();
    cy['auth/signIn'](user)
      .visit('/profile');

    cy.get('.profile__password button[type="submit"]')
      .click();
    cy.get('.profile__password form')
      .contains(/current.*password.*required/i)
      .should('be.visible');
    cy.get('.profile__password form')
      .contains(/new.*password.*required/i)
      .should('be.visible');
    cy.get('.profile__password form')
      .contains(/new.*password.*confirm.*required/i)
      .should('be.visible');

    cy.get('.profile__password input[name="password"]')
      .type(user.password);
    cy.get('.profile__password input[name="newPassword"]')
      .type(update.password);
    cy.get('.profile__password input[name="newPasswordConfirm"]')
      .type(user.password);
    cy.get('.profile__password form')
      .contains(/current.*password.*required/i)
      .should('not.be.visible');
    cy.get('.profile__password form')
      .contains(/password.*must.*match/i)
      .should('be.visible');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 401, response: { error: 'INVALID_CREDENTIALS' } });
    cy.get('.profile__password input[name="newPasswordConfirm"]')
      .clear().type(update.password);
    cy.get('.profile__password form')
      .submit();
    cy.get('.profile__password form')
      .contains(/password.*invalid/i)
      .should('be.visible');
  });

  it('Should update the users password', () => {
    const update = mocks.getUser();
    cy['auth/signIn'](user)
      .visit('/profile');

    cy.server()
      .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 200, response: '', delay: 64 });
    cy.get('.profile__password input[name="password"]')
      .type(user.password);
    cy.get('.profile__password input[name="newPassword"]')
      .type(update.password);
    cy.get('.profile__password input[name="newPasswordConfirm"]')
      .type(update.password);
    cy.get('.profile__password__submit')
      .click()
      .should('be.disabled');

    cy.get('.layout-notifications')
      .contains(/password.*updated/i)
      .should('be.visible');
  });
});
