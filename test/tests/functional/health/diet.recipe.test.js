import mocks from '../../../support/mocks';
import stubs from '../../../support/stubs';

const user = mocks.getUser();

describe('Functional / Health / Recipes', () => {
  beforeEach(() => {
    cy['core/signIn'](user)
      .viewport('iphone-6');
  });

  it('Should allow the user to CREATE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipe = mocks.getRecipe(user.id, foods);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/food-and-recipes?selected=new-recipe');

    cy.server()
      .route({ method: 'PUT', url: '/api/health/diet/recipes', status: 200, response: recipe, delay: 128 });
    fillForm(recipe);
    verifySummary(getNutrientSummary(recipe));
    cy.get('.recipe-modal__form')
      .submit();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/recipe.*saved/i)
      .should('be.visible');
    verifyInTable(recipe);
  });

  it('Should allow the user to READ a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const existingRecipe = recipes[0];
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes })
      .visit('/health/food-and-recipes');

    cy.get('.diet .diet-table tbody')
      .contains(existingRecipe.name)
      .click();
    verifyInForm(existingRecipe);
    verifySummary(getNutrientSummary(existingRecipe));
    cy.screenshot();
    cy.get('.diet__recipe-modal .modal__toolbar__cancel')
      .click();

    cy.get('.diet__fab')
      .should('be.visible')
      .click();
    cy.get('.diet__fab__new-recipe')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('.recipe-modal__form')
      .should('be.visible');
    cy.screenshot();
    cy.get('.recipe-modal__form')
      .submit()
      .contains(/name.*required/i)
      .should('be.visible');
    cy.get('.diet__recipe-modal .modal__toolbar__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('.recipe-modal__form')
      .should('not.be.visible');

    cy.viewport('macbook-13');

    cy.get('.diet .diet-table tbody')
      .contains(existingRecipe.name)
      .click();
    cy.get('.recipe-modal__summary')
      .scrollIntoView();
    cy.screenshot();
    cy.get('.diet__recipe-modal .modal__cancel')
      .click();

    cy.get('.diet__new-recipe')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('.recipe-modal__form')
      .should('be.visible');
    cy.get('.recipe-modal__summary')
      .scrollIntoView();
    cy.screenshot();
    cy.get('.modal__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('.recipe-modal__form')
      .should('not.be.visible');
  });

  it('Should allow the user to UPDATE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const existingRecipe = recipes[0];
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes })
      .visit('/health/food-and-recipes');

    cy.get('.diet .diet-table tbody').contains(existingRecipe.name)
      .click();
    verifyInForm(existingRecipe);
    verifySummary(getNutrientSummary(existingRecipe));

    const update = { ...mocks.getRecipe(user.id, foods), id: existingRecipe.id };
    cy.server()
      .route({ method: 'PATCH', url: `/api/health/diet/recipes/${update.id}`, status: 200, response: update, delay: 128 });
    fillForm(update, { clear: true, oldRecipe: existingRecipe });
    verifySummary(getNutrientSummary(update));
    cy.get('.recipe-modal__form').as('form')
      .submit();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/recipe.*saved/i).should('be.visible');
    verifyInTable(update);
  });

  it('Should allow the user to DELETE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const recipe = recipes[0];
    cy['core/signIn'](user);
    stubs['health/dietItems'](user, { foods, recipes })
      .visit(`/health/food-and-recipes?selected=${recipe.id}`);

    cy.get('.modal__toolbar__remove')
      .click();
    cy.get('.modal__confirm-remove')
      .should('be.visible');
    cy.get('.modal__confirm-remove__cancel')
      .click();
    cy.get('.modal__toolbar__cancel')
      .click();
    verifyInTable(recipe);

    cy.server()
      .route({ method: 'DELETE', url: `/api/health/diet/recipes/${recipe.id}`, status: 200, response: '', delay: 64 });
    cy.get('.diet .diet-table tbody').as('table')
      .contains(recipe.name)
      .click();
    cy.get('.modal__toolbar__remove')
      .click();
    cy.get('.modal__confirm-remove__confirm')
      .click();
    cy.get('.modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.notifications')
      .contains(/recipe.*deleted/i).should('be.visible');
    cy.get('@table')
      .contains(recipe.name).should('not.be.visible');
  });
});

function fillForm (recipe, { clear = false, oldRecipe } = {}) {
  const clearWrapper = ($el) => clear ? $el.clear() : $el;
  clearWrapper(cy.get('input[name="name"]'))
    .type(recipe.name);
  clearWrapper(cy.get('input[name="description"]'))
    .type(recipe.description);
  clearWrapper(cy.get('input[name="servingValue"]'))
    .type(recipe.serving.value);
  cy.get('.recipe-modal__form__serving__unit .v-select__slot')
    .click()
    .get('.v-select-list').contains(recipe.serving.unit)
    .click();

  if (oldRecipe) {
    cy.get('.recipe-modal__fab')
      .click();
    cy.get('.recipe-modal__fab__remove')
      .click();
    for (const ingredient of oldRecipe.ingredients) {
      cy.get('.recipe-modal__ingredients').contains(ingredient.name)
        .click();
    }
    cy.get('.recipe-modal__fab')
      .click();
    cy.get('.recipe-modal__fab__remove')
      .click();
  }

  cy.get('.recipe-modal__fab')
    .click();
  cy.get('.recipe-modal__fab__ingredients')
    .click();

  for (const ingredient of recipe.ingredients) {
    toggleIngredient(ingredient);
  }
  for (const ingredient of recipe.ingredients) {
    changeAmount(ingredient, ingredient.amount);
  }

  cy.get('.recipe-modal__ingredient-selector .modal__toolbar__confirm')
    .click();
}

function toggleIngredient (ingredient) {
  return cy.get('.recipe-modal__ingredient-selector').contains(ingredient.name)
    .click();
}

function changeAmount (ingredient, value) {
  cy.get('.recipe-modal__ingredient-selector')
    .contains(ingredient.name).parents('tr').find('.diet-table__table__amount-display')
    .scrollIntoView()
    .click();
  return cy.get(`input[name="amount"][data-id="${ingredient.id}"]`)
    .scrollIntoView()
    .clear().type(`${value}{enter}`);
}

function verifySelectorRow (ingredient, { checkSelected = false } = {}) {
  cy.get('.recipe-modal__ingredient-selector').contains(ingredient.name).parents('tr').as('selectorRow')
    .contains(formatValue(ingredient.serving.value))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.calories))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.carbs))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.protein))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.fat))
    .scrollIntoView().should('be.visible');

  if (checkSelected) {
    cy.get('@selectorRow')
      .should('have.class', 'v-data-table__selected');
  }
}

function verifyIngredientsRow (ingredient) {
  cy.get('.recipe-modal__ingredients').contains(ingredient.name).parents('tr').as('ingredientsRow')
    .contains(formatValue(ingredient.amount))
    .scrollIntoView().should('be.visible');

  const multiplier = ingredient.amount / ingredient.serving.value;
  const { calories, carbs, protein, fat } = ingredient.nutrients;
  cy.get('@ingredientsRow').contains(formatValue(calories * multiplier))
    .scrollIntoView().should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(carbs * multiplier))
    .scrollIntoView().should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(protein * multiplier))
    .scrollIntoView().should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(fat * multiplier))
    .scrollIntoView().should('be.visible');
}

function verifySummary (summary) {
  const { calories, carbs, protein, fat } = summary;
  cy.get('.recipe-modal__summary').as('summary')
    .scrollIntoView()
    .contains(formatValue(calories)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(carbs)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(protein)).should('be.visible');
  cy.get('@summary')
    .contains(formatValue(fat)).should('be.visible');

  const total = carbs + protein + fat;
  cy.get('@summary')
    .contains(`${formatValue(carbs / total * 100)} %`).should('to.exist');
  cy.get('@summary')
    .contains(`${formatValue(protein / total * 100)} %`).should('to.exist');
  cy.get('@summary')
    .contains(`${formatValue(fat / total * 100)} %`).should('to.exist');
}

function verifyInTable (recipe) {
  const nutrients = getNutrientSummary(recipe);
  cy.get('.diet .diet-table tbody').contains(recipe.name).parents('tr').as('row')
    .find('.v-icon[data-item-type="Recipe"]').should('be.visible');
  cy.get('@row')
    .contains(recipe.serving.value).should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.calories)).should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.carbs)).should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.protein)).should('be.visible');
  return cy.get('@row')
    .contains(formatValue(nutrients.fat)).should('be.visible');
}

function verifyInForm (recipe) {
  cy.get('input[name="name"]')
    .should('have.value', recipe.name);
  cy.get('input[name="description"]')
    .should('have.value', recipe.description);
  cy.get('input[name="servingValue"]')
    .should('have.value', `${recipe.serving.value}`);
  cy.get('input[name="servingUnit"]')
    .should('have.value', `${recipe.serving.unit}`);

  cy.get('.recipe-modal__fab')
    .click();
  cy.get('.recipe-modal__fab__ingredients')
    .click();
  for (const ingredient of recipe.ingredients) {
    verifySelectorRow(ingredient, { checkSelected: true });
  }
  cy.get('.recipe-modal__ingredient-selector .modal__toolbar__cancel')
    .click();

  for (const ingredient of recipe.ingredients) {
    verifyIngredientsRow(ingredient);
  }
}

function formatValue (nutrient) {
  return parseFloat(nutrient).toFixed(2);
}

function getNutrientSummary ({ ingredients }) {
  return ingredients.reduce((summary, nextItem) => {
    const multiplier = nextItem.amount / nextItem.serving.value;
    summary.calories += nextItem.nutrients.calories * multiplier;
    summary.carbs += nextItem.nutrients.carbs * multiplier;
    summary.protein += nextItem.nutrients.protein * multiplier;
    summary.fat += nextItem.nutrients.fat * multiplier;
    return summary;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
}
