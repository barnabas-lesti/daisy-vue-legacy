import mocks from '../../support/mocks';
import stubs from '../../support/stubs';

const user = mocks.getUser();

describe('Functional / Diet', () => {
  beforeEach(() => {
    cy['auth/signIn'](user)
      .viewport('iphone-6');
  });

  it('Should have the appropriate title', () => {
    cy.visit('/food-and-recipes');
    cy.title()
      .should('eq', 'Food & Recipes | Daisy');
    cy.get('.layout-navbar__title')
      .contains('Food & Recipes')
      .should('be.visible');
  });

  it('Page is accessible from the sidebar', () => {
    stubs['diet/items'](user)
      .visit('/');

    cy.get('.layout-navbar__toggle')
      .click();
    cy.get('.layout-sidebar-list-item--diet')
      .click()
      .should('have.class', 'v-list-item--active');
    cy.url()
      .should('include', '/food-and-recipes');
  });

  it('Should allow filtering on the table items', () => {
    const foods = mocks.getFoods(user.id);
    stubs['diet/items'](user, { foods })
      .visit('/food-and-recipes');

    cy.get('.diet-table-filters__search')
      .type(foods[0].name);
    cy.get('.diet .diet-table tbody')
      .contains(foods[0].name).should('be.visible');
    cy.get('.diet .diet-table tbody')
      .contains(foods[1].name).should('not.be.visible');
  });


  it('Should allow the user to CREATE food', () => {
    const food = mocks.getFood(user.id);
    stubs['diet/items'](user)
      .visit('/food-and-recipes?selected=new-food');

    cy.get('.diet-food-modal__form')
      .submit()
      .contains(/name.*required/i)
      .should('be.visible');
    fillFoodForm(food);

    cy.server()
      .route({ method: 'PUT', url: '/api/diet/foods', status: 200, response: food, delay: 64 });
    cy.get('.diet-food-modal__form')
      .submit();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/food.*saved/i)
      .should('be.visible');
    verifyFoodInTable(food);
  });

  it('Should allow the user to READ existing food', () => {
    const foods = mocks.getFoods(user.id);
    const food = foods[0];
    stubs['diet/items'](user, { foods })
      .visit('/food-and-recipes');

    cy.get('.diet__fab')
      .click();
    cy.get('.diet__fab__new-food')
      .click();
    cy.url()
      .should('include', 'selected=new-food');
    cy.get('.diet-food-modal__form')
      .should('be.visible');

    cy.get('.common-modal__toolbar__cancel')
      .click();
    cy.url()
      .should('not.include', 'selected=new-food');
    cy.get('.diet-food-modal__form')
      .should('not.be.visible');

    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .click();
    cy.url()
      .should('include', `selected=${food.id}`);
    verifyFoodForm(food);
    cy.get('.common-modal__toolbar__remove')
      .should('be.visible');
    cy.get('.common-modal__toolbar__confirm')
      .should('be.visible');
    cy.get('.common-modal__toolbar__cancel')
      .click();

    cy.viewport('macbook-13');

    cy.get('.diet__new-food')
      .click();
    cy.url()
      .should('include', 'selected=new-food');
    cy.get('.diet-food-modal__form')
      .should('be.visible');
    cy.get('.common-modal__cancel')
      .click();
    cy.url()
      .should('not.include', 'selected=new-food');
    cy.get('.diet-food-modal__form')
      .should('not.be.visible');

    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .click();
    verifyFoodForm(food);
    cy.get('.common-modal__remove')
      .should('be.visible');
    cy.get('.common-modal__confirm')
      .should('be.visible');
    cy.get('.common-modal__cancel')
      .click();
  });

  it('Should allow the user to UPDATE food', () => {
    const foods = mocks.getFoods(user.id);
    const existingFood = foods[0];
    const update = { ...mocks.getFood(user.id), id: existingFood.id };
    stubs['diet/items'](user, { foods })
      .visit('/food-and-recipes');

    cy.server()
      .route({ method: 'PATCH', url: `/api/diet/foods/${update.id}`, status: 200, response: update, delay: 64 });
    cy.get('.diet .diet-table tbody')
      .contains(existingFood.name)
      .click();
    fillFoodForm(update, { clear: true });
    cy.get('.diet-food-modal__form')
      .submit();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/food.*saved/i).should('be.visible');
    verifyFoodInTable(update);
  });

  it('Should allow the user to DELETE food', () => {
    const foods = mocks.getFoods(user.id);
    const food = foods[0];
    stubs['diet/items'](user, { foods })
      .visit(`/food-and-recipes?selected=${food.id}`);

    cy.get('.common-modal__toolbar__remove')
      .click();
    cy.get('.common-modal__confirm-remove')
      .should('be.visible');
    cy.get('.common-modal__confirm-remove__cancel')
      .click();
    cy.get('.common-modal__toolbar__cancel')
      .click();
    verifyFoodInTable(food);

    cy.server()
      .route({ method: 'DELETE', url: `/api/diet/foods/${food.id}`, status: 200, response: '', delay: 64 });
    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .click();
    cy.get('.common-modal__toolbar__remove')
      .click();
    cy.get('.common-modal__confirm-remove__confirm')
      .click();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/food.*deleted/i)
      .should('be.visible');
    cy.get('.diet .diet-table tbody')
      .contains(food.name)
      .should('not.be.visible');
  });

  it('Should allow the user to CREATE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipe = mocks.getRecipe(user.id, foods);
    stubs['diet/items'](user, { foods })
      .visit('/food-and-recipes?selected=new-recipe');

    cy.server()
      .route({ method: 'PUT', url: '/api/diet/recipes', status: 200, response: recipe, delay: 128 });
    fillRecipeModalForm(recipe);
    verifyRecipeSummary(getRecipeNutrientSummary(recipe));
    cy.get('.diet-recipe-modal__form')
      .submit();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/recipe.*saved/i)
      .should('be.visible');
    verifyRecipeInTable(recipe);
  });

  it('Should allow the user to READ a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const existingRecipe = recipes[0];
    cy['auth/signIn'](user);
    stubs['diet/items'](user, { foods, recipes })
      .visit('/food-and-recipes');

    cy.get('.diet .diet-table tbody')
      .contains(existingRecipe.name)
      .click();
    verifyRecipeForm(existingRecipe);
    verifyRecipeSummary(getRecipeNutrientSummary(existingRecipe));
    cy.screenshot();
    cy.get('.diet__recipe-modal .common-modal__toolbar__cancel')
      .click();

    cy.get('.diet__fab')
      .should('be.visible')
      .click();
    cy.get('.diet__fab__new-recipe')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('.diet-recipe-modal__form')
      .should('be.visible');
    cy.screenshot();
    cy.get('.diet-recipe-modal__form')
      .submit()
      .contains(/name.*required/i)
      .should('be.visible');
    cy.get('.diet__recipe-modal .common-modal__toolbar__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('.diet-recipe-modal__form')
      .should('not.be.visible');

    cy.viewport('macbook-13');

    cy.get('.diet .diet-table tbody')
      .contains(existingRecipe.name)
      .click();
    cy.get('.diet-recipe-modal__summary')
      .scrollIntoView();
    cy.screenshot();
    cy.get('.diet__recipe-modal .common-modal__cancel')
      .click();

    cy.get('.diet__new-recipe')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('.diet-recipe-modal__form')
      .should('be.visible');
    cy.get('.diet-recipe-modal__summary')
      .scrollIntoView();
    cy.screenshot();
    cy.get('.common-modal__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('.diet-recipe-modal__form')
      .should('not.be.visible');
  });

  it('Should allow the user to UPDATE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const existingRecipe = recipes[0];
    cy['auth/signIn'](user);
    stubs['diet/items'](user, { foods, recipes })
      .visit('/food-and-recipes');

    cy.get('.diet .diet-table tbody').contains(existingRecipe.name)
      .click();
    verifyRecipeForm(existingRecipe);
    verifyRecipeSummary(getRecipeNutrientSummary(existingRecipe));

    const update = { ...mocks.getRecipe(user.id, foods), id: existingRecipe.id };
    cy.server()
      .route({ method: 'PATCH', url: `/api/diet/recipes/${update.id}`, status: 200, response: update, delay: 128 });
    fillRecipeModalForm(update, { clear: true, oldRecipe: existingRecipe });
    verifyRecipeSummary(getRecipeNutrientSummary(update));
    cy.get('.diet-recipe-modal__form')
      .submit();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/recipe.*saved/i).should('be.visible');
    verifyRecipeInTable(update);
  });

  it('Should allow the user to DELETE a recipe', () => {
    const foods = mocks.getFoods(user.id);
    const recipes = mocks.getRecipes(user.id, foods);
    const recipe = recipes[0];
    cy['auth/signIn'](user);
    stubs['diet/items'](user, { foods, recipes })
      .visit(`/food-and-recipes?selected=${recipe.id}`);

    cy.get('.common-modal__toolbar__remove')
      .click();
    cy.get('.common-modal__confirm-remove')
      .should('be.visible');
    cy.get('.common-modal__confirm-remove__cancel')
      .click();
    cy.get('.common-modal__toolbar__cancel')
      .click();
    verifyRecipeInTable(recipe);

    cy.server()
      .route({ method: 'DELETE', url: `/api/diet/recipes/${recipe.id}`, status: 200, response: '', delay: 64 });
    cy.get('.diet .diet-table tbody')
      .contains(recipe.name)
      .click();
    cy.get('.common-modal__toolbar__remove')
      .click();
    cy.get('.common-modal__confirm-remove__confirm')
      .click();
    cy.get('.common-modal__toolbar__confirm')
      .should('have.class', 'v-btn--loading');
    cy.get('.layout-notifications')
      .contains(/recipe.*deleted/i)
      .should('be.visible');
    cy.get('.diet .diet-table tbody')
      .contains(recipe.name)
      .should('not.be.visible');
  });
});

function fillFoodForm (food, { clear = false } = {}) {
  const clearWrapper = ($el) => clear ? $el.clear() : $el;
  clearWrapper(cy.get('input[name="name"]'))
    .type(food.name);
  clearWrapper(cy.get('input[name="description"]'))
    .type(food.description);
  clearWrapper(cy.get('input[name="servingValue"]'))
    .type(food.serving.value);
  cy.get('.diet-food-modal__form__serving__unit .v-select__slot')
    .click()
    .get('.v-select-list')
    .contains(food.serving.unit)
    .click();
  clearWrapper(cy.get('input[name="calories"]'))
    .type(food.nutrients.calories);
  clearWrapper(cy.get('input[name="carbs"]'))
    .type(food.nutrients.carbs);
  clearWrapper(cy.get('input[name="protein"]'))
    .type(food.nutrients.protein);
  return clearWrapper(cy.get('input[name="fat"]'))
    .type(food.nutrients.fat);
}

function verifyFoodInTable (food) {
  cy.get('.diet .diet-table tbody').contains(food.name).parents('tr').as('row');
  cy.get('@row')
    .find('.v-icon[data-item-type="Food"]')
    .should('be.visible');
  cy.get('@row')
    .contains(food.serving.value)
    .should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.calories)
    .should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.carbs)
    .should('be.visible');
  cy.get('@row')
    .contains(food.nutrients.protein)
    .should('be.visible');
  return cy.get('@row')
    .contains(food.nutrients.fat)
    .should('be.visible');
}

function verifyFoodForm (food) {
  cy.get('input[name="name"]')
    .should('have.value', food.name);
  cy.get('input[name="description"]')
    .should('have.value', food.description);
  cy.get('input[name="servingValue"]')
    .should('have.value', `${food.serving.value}`);
  cy.get('input[name="servingUnit"]')
    .should('have.value', `${food.serving.unit}`);
  cy.get('input[name="calories"]')
    .should('have.value', `${food.nutrients.calories}`);
  cy.get('input[name="carbs"]')
    .should('have.value', `${food.nutrients.carbs}`);
  cy.get('input[name="protein"]')
    .should('have.value', `${food.nutrients.protein}`);
  return cy.get('input[name="fat"]')
    .should('have.value', `${food.nutrients.fat}`);
}

function fillRecipeModalForm (recipe, { clear = false, oldRecipe } = {}) {
  const clearWrapper = ($el) => clear ? $el.clear() : $el;
  clearWrapper(cy.get('input[name="name"]'))
    .type(recipe.name);
  clearWrapper(cy.get('input[name="description"]'))
    .type(recipe.description);
  clearWrapper(cy.get('input[name="servingValue"]'))
    .type(recipe.serving.value);
  cy.get('.diet-recipe-modal__form__serving__unit .v-select__slot')
    .click()
    .get('.v-select-list').contains(recipe.serving.unit)
    .click();

  if (oldRecipe) {
    cy.get('.diet-recipe-modal__fab')
      .click();
    cy.get('.diet-recipe-modal__fab__remove')
      .click();
    for (const ingredient of oldRecipe.ingredients) {
      cy.get('.diet-recipe-modal__ingredients').contains(ingredient.name)
        .click();
    }
    cy.get('.diet-recipe-modal__fab')
      .click();
    cy.get('.diet-recipe-modal__fab__remove')
      .click();
  }

  cy.get('.diet-recipe-modal__fab')
    .click();
  cy.get('.diet-recipe-modal__fab__ingredients')
    .click();

  for (const ingredient of recipe.ingredients) {
    cy.get('.diet-recipe-modal__ingredient-selector')
      .contains(ingredient.name)
      .click();
  }
  for (const ingredient of recipe.ingredients) {
    cy.get('.diet-recipe-modal__ingredient-selector')
      .contains(ingredient.name).parents('tr').find('.diet-table__table__amount-display')
      .scrollIntoView()
      .click();
    cy.get(`input[name="amount"][data-id="${ingredient.id}"]`)
      .scrollIntoView()
      .clear().type(`${ingredient.amount}{enter}`);
  }

  cy.get('.diet-recipe-modal__ingredient-selector .common-modal__toolbar__confirm')
    .click();
}

function verifyRecipeIngredientSelectorRow (ingredient, { checkSelected = false } = {}) {
  cy.get('.diet-recipe-modal__ingredient-selector').contains(ingredient.name).parents('tr').as('selectorRow')
    .contains(formatValue(ingredient.serving.value))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.calories))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.carbs))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.protein))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@selectorRow').contains(formatValue(ingredient.nutrients.fat))
    .scrollIntoView()
    .should('be.visible');

  if (checkSelected) {
    cy.get('@selectorRow')
      .should('have.class', 'v-data-table__selected');
  }
}

function verifyRecipeIngredientsRow (ingredient) {
  cy.get('.diet-recipe-modal__ingredients').contains(ingredient.name).parents('tr').as('ingredientsRow')
    .contains(formatValue(ingredient.amount))
    .scrollIntoView()
    .should('be.visible');

  const multiplier = ingredient.amount / ingredient.serving.value;
  const { calories, carbs, protein, fat } = ingredient.nutrients;
  cy.get('@ingredientsRow').contains(formatValue(calories * multiplier))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(carbs * multiplier))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(protein * multiplier))
    .scrollIntoView()
    .should('be.visible');
  cy.get('@ingredientsRow').contains(formatValue(fat * multiplier))
    .scrollIntoView()
    .should('be.visible');
}

function verifyRecipeSummary (summary) {
  const { calories, carbs, protein, fat } = summary;
  cy.get('.diet-recipe-modal__summary').as('summary')
    .scrollIntoView()
    .contains(formatValue(calories))
    .should('be.visible');
  cy.get('@summary')
    .contains(formatValue(carbs))
    .should('be.visible');
  cy.get('@summary')
    .contains(formatValue(protein))
    .should('be.visible');
  cy.get('@summary')
    .contains(formatValue(fat))
    .should('be.visible');

  const total = carbs + protein + fat;
  cy.get('@summary')
    .contains(`${formatValue(carbs / total * 100)} %`)
    .should('to.exist');
  cy.get('@summary')
    .contains(`${formatValue(protein / total * 100)} %`)
    .should('to.exist');
  cy.get('@summary')
    .contains(`${formatValue(fat / total * 100)} %`)
    .should('to.exist');
}

function verifyRecipeInTable (recipe) {
  const nutrients = getRecipeNutrientSummary(recipe);
  cy.get('.diet .diet-table tbody').contains(recipe.name).parents('tr').as('row')
    .find('.v-icon[data-item-type="Recipe"]')
    .should('be.visible');
  cy.get('@row')
    .contains(recipe.serving.value)
    .should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.calories))
    .should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.carbs))
    .should('be.visible');
  cy.get('@row')
    .contains(formatValue(nutrients.protein))
    .should('be.visible');
  return cy.get('@row')
    .contains(formatValue(nutrients.fat))
    .should('be.visible');
}

function verifyRecipeForm (recipe) {
  cy.get('input[name="name"]')
    .should('have.value', recipe.name);
  cy.get('input[name="description"]')
    .should('have.value', recipe.description);
  cy.get('input[name="servingValue"]')
    .should('have.value', `${recipe.serving.value}`);
  cy.get('input[name="servingUnit"]')
    .should('have.value', `${recipe.serving.unit}`);

  cy.get('.diet-recipe-modal__fab')
    .click();
  cy.get('.diet-recipe-modal__fab__ingredients')
    .click();
  for (const ingredient of recipe.ingredients) {
    verifyRecipeIngredientSelectorRow(ingredient, { checkSelected: true });
  }
  cy.get('.diet-recipe-modal__ingredient-selector .common-modal__toolbar__cancel')
    .click();

  for (const ingredient of recipe.ingredients) {
    verifyRecipeIngredientsRow(ingredient);
  }
}

function formatValue (nutrient) {
  return parseFloat(nutrient).toFixed(2);
}

function getRecipeNutrientSummary ({ ingredients }) {
  return ingredients.reduce((summary, nextItem) => {
    const multiplier = nextItem.amount / nextItem.serving.value;
    summary.calories += nextItem.nutrients.calories * multiplier;
    summary.carbs += nextItem.nutrients.carbs * multiplier;
    summary.protein += nextItem.nutrients.protein * multiplier;
    summary.fat += nextItem.nutrients.fat * multiplier;
    return summary;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });
}