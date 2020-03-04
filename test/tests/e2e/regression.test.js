import mocks from '../../support/mocks';

describe('E2E / Regression', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('Daisy should work as expected 😉', () => {
    const user = mocks.user();
    cy.visit('/');

    // Registration
    cy.get('.sign-in-form__register-link')
      .click();
    cy.get('input[name="email"]')
      .type(user.email);
    cy.get('input[name="password"]')
      .type(user.password);
    cy.get('input[name="passwordConfirm"]')
      .type(user.password);
    cy.get('form')
      .submit();

    // Sign in
    cy.get('input[name="password"]')
      .type(user.password);
    cy.get('form')
      .submit();

    // Update profile
    cy.get('.profile-menu__activator')
      .click();
    cy.get('.profile-menu__item--profile')
      .click();
    cy.get('input[name="fullName"]')
      .clear().type(user.fullName);
    cy.get('input[name="profileImageUrl"]')
      .clear().type(user.profileImageUrl);
    cy.get('.profile__general form')
      .click();

    const { password: newPassword } = mocks.user();
    cy.get('input[name="password"]')
      .type(user.password);
    cy.get('input[name="newPassword"]')
      .type(newPassword);
    cy.get('input[name="newPasswordConfirm"]')
      .type(newPassword);
    cy.get('.profile__password form')
      .submit();

    // Sign out and in again
    cy.get('.profile-menu__activator')
      .click();
    cy.get('.profile-menu__item--sign-out')
      .click();
    cy.get('input[name="email"]')
      .type(user.email);
    cy.get('input[name="password"]')
      .type(newPassword);
    cy.get('form')
      .submit();

    // Go to diet
    cy.get('.navbar__toggle')
      .click();
    cy.get('.list-group--health')
      .click();
    cy.get('.list-item--health-diet')
      .click();

    // Create food
    const food = mocks.food();
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
    cy.get('.food-modal__form__serving__unit .v-select__slot')
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
    cy.get('.food-modal__form')
      .submit();

    // Re-save (update) food
    cy.viewport('macbook-13');
    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .click();
    cy.get('.diet__food-modal .modal__confirm')
      .click();
    cy.viewport('iphone-6');

    // Crate recipe
    const recipe = mocks.recipe(user.id, [ food ], 1);
    cy.get('.diet__fab')
      .click();
    cy.get('.diet__fab__new-recipe')
      .click();
    cy.get('.recipe-modal__form input[name="name"]')
      .type(recipe.name);
    cy.get('.recipe-modal__form input[name="description"]')
      .type(recipe.description);
    cy.get('.recipe-modal__form input[name="servingValue"]')
      .type(recipe.serving.value);
    cy.get('.recipe-modal__form__serving__unit .v-select__slot')
      .click()
      .get('.v-select-list').contains(recipe.serving.unit)
      .click();
    cy.get('.recipe-modal__fab')
      .click();
    cy.get('.recipe-modal__fab__ingredients')
      .click();
    for (const ingredient of recipe.ingredients) {
      cy.get('.recipe-modal__ingredient-selector')
        .contains(ingredient.name)
        .click();
    }
    cy.get('.recipe-modal__ingredient-selector .modal__toolbar__confirm')
      .click();
    cy.get('.recipe-modal__form')
      .submit();

    // Re-save (update) recipe
    cy.viewport('macbook-13');
    cy.get('.diet .diet-table')
      .contains(recipe.name)
      .click();
    cy.get('.diet__recipe-modal .modal__confirm')
      .click();
    cy.viewport('iphone-6');
    cy.wait(300);

    // Go to diary
    cy.get('.navbar__toggle')
      .click();
    cy.get('.list-item--health-diary')
      .click();

    // Add items to diary
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__open-select-modal')
      .click();
    cy.get('.select-modal__table')
      .contains(food.name)
      .click();
    cy.get('.modal__toolbar__confirm')
      .click();
    cy.get('.diary__fab')
      .click();
    cy.get('.diary__fab__save')
      .click();

    // Re-save (update) diary
    cy.viewport('macbook-13');
    cy.get('.diary__open-select-modal')
      .click();
    cy.get('.select-modal__table')
      .contains(recipe.name)
      .click();
    cy.get('.modal__confirm')
      .click();
    cy.get('.diary__save')
      .click();
  });
});
