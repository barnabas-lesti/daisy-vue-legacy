import mocks from '../../support/mocks';

describe('E2E / Regression', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Daisy should work as expected 😉', () => {
    const user = mocks.getUser();
    cy.visit('/');

    // Registration
    cy.get('.sign-in-form__register-link')
      .click();
    cy.get('.register-form input[name="email"]')
      .type(user.email);
    cy.get('.register-form input[name="password"]')
      .type(user.password);
    cy.get('.register-form input[name="passwordConfirm"]')
      .type(user.password);
    cy.get('.register-form')
      .submit();

    // Sign in
    cy.get('.sign-in-form input[name="password"]')
      .type(user.password);
    cy.get('.sign-in-form')
      .submit();

    // Update profile
    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__item--profile')
      .click();
    cy.get('.profile__general input[name="fullName"]')
      .clear().type(user.fullName);
    cy.get('.profile__general input[name="profileImageUrl"]')
      .clear().type(user.profileImageUrl);
    cy.get('.profile__general button[type="submit"]')
      .click();

    const { password: newPassword } = mocks.getUser();
    cy.get('.profile__password input[name="password"]')
      .type(user.password);
    cy.get('.profile__password input[name="newPassword"]')
      .type(newPassword);
    cy.get('.profile__password input[name="newPasswordConfirm"]')
      .type(newPassword);
    cy.get('.profile__password form')
      .submit();

    // Sign out and in again
    cy.get('.layout-navbar-profile-menu__activator')
      .click();
    cy.get('.layout-navbar-profile-menu__item--sign-out')
      .click();
    cy.get('.sign-in input[name="email"]')
      .type(user.email);
    cy.get('.sign-in input[name="password"]')
      .type(newPassword);
    cy.get('.sign-in form')
      .submit();

    // Go to diet
    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--diet')
      .click();

    // Create food
    const food = mocks.getFood();
    cy.get('.diet__fab')
      .click();
    cy.get('.diet__fab__new-food')
      .click();

    cy.get('input[name="name"]')
      .type(food.name);
    cy.get('input[name="description"]')
      .type(food.description);
    cy.get('input[name="servingValue"]')
      .type(food.serving.value);
    cy.get('.diet-food-modal__form__serving__unit .v-select__slot')
      .click()
      .get('.v-select-list')
      .contains(food.serving.unit)
      .click();
    cy.get('input[name="calories"]')
      .type(food.nutrients.calories);
    cy.get('input[name="carbs"]')
      .type(food.nutrients.carbs);
    cy.get('input[name="protein"]')
      .type(food.nutrients.protein);
    cy.get('input[name="fat"]')
      .type(food.nutrients.fat);
    cy.get('.diet-food-modal__form')
      .submit();

    // Re-save (update) food
    cy.viewport('macbook-13');
    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .click();
    cy.get('.diet__food-modal .common-modal__confirm')
      .click();
    cy.viewport('iphone-6');

    // Crate recipe
    const recipe = mocks.getRecipe(user.id, [ food ], 1);
    cy.get('.diet__fab')
      .click();
    cy.get('.diet__fab__new-recipe')
      .click();
    cy.get('.diet-recipe-modal__form input[name="name"]')
      .type(recipe.name);
    cy.get('.diet-recipe-modal__form input[name="description"]')
      .type(recipe.description);
    cy.get('.diet-recipe-modal__form input[name="servingValue"]')
      .type(recipe.serving.value);
    cy.get('.diet-recipe-modal__form__serving__unit .v-select__slot')
      .click()
      .get('.v-select-list').contains(recipe.serving.unit)
      .click();
    cy.get('.diet-recipe-modal__fab')
      .click();
    cy.get('.diet-recipe-modal__fab__ingredients')
      .click();
    for (const ingredient of recipe.ingredients) {
      cy.get('.diet-recipe-modal__ingredient-selector')
        .contains(ingredient.name)
        .click();
    }
    cy.get('.diet-recipe-modal__ingredient-selector .common-modal__toolbar__confirm')
      .click();
    cy.get('.diet-recipe-modal__form')
      .submit();

    // Re-save (update) recipe
    cy.viewport('macbook-13');
    cy.get('.diet .diet-table')
      .contains(recipe.name)
      .click();
    cy.get('.diet__recipe-modal .common-modal__confirm')
      .click();
    cy.viewport('iphone-6');
    cy.wait(300);

    // Go to diary
    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--diary')
      .click();

    // Add items to diary
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__open-select-modal')
      .click();
    cy.get('.diet-select-modal__table')
      .contains(food.name)
      .click();
    cy.get('.common-modal__toolbar__confirm')
      .click();
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__save')
      .click();

    // Re-save (update) diary
    cy.viewport('macbook-13');
    cy.get('.diary__open-select-modal')
      .click();
    cy.get('.diet-select-modal__table')
      .contains(recipe.name)
      .click();
    cy.get('.common-modal__confirm')
      .click();
    cy.get('.diary__save')
      .click();

    // Visit the dashboard
    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--dashboard')
      .click();
  });
});
