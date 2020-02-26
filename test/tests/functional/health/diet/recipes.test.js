import mocks from '../../../../support/mocks';
import stubs from '../../../../support/stubs';

const user = mocks.user();

describe('Functional / Health / Recipes', () => {
  beforeEach(() => {
    cy['core/signIn'](user)
      .viewport('iphone-6');
  });

  it('Recipe modal should be accessible', () => {
    stubs['health/dietItems'](user)
      .visit('/health/diet');
    cy.get('.diet__fab')
      .should('be.visible')
      .click();
    cy.get('.diet__fab__new-recipe')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('.recipe-modal__form').as('recipeForm')
      .should('be.visible');
    cy.get('@recipeForm')
      .submit()
      .contains(/name.*required/i).should('be.visible');

    cy.get('.modal__toolbar__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('@recipeForm')
      .should('not.be.visible');

    cy.viewport('macbook-13')
      .get('.diet__new-recipe')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', 'selected=new-recipe');
    cy.get('@recipeForm')
      .should('be.visible');
    cy.get('.modal__cancel')
      .should('be.visible')
      .click();
    cy.url()
      .should('not.include', 'selected=new-recipe');
    cy.get('@recipeForm')
      .should('not.be.visible');
  });

  it('Should update ingredient when amount changed', () => {
    const foods = mocks.foods(user.id);
    const recipe = mocks.recipe(user.id, foods);
    stubs['health/dietItems'](user, { foods })
      .visit('/health/diet?selected=new-recipe');

    cy.get('.recipe-modal__summary').as('summary')
      .contains(/add.*ingredients/i).should('be.visible');

    cy.get('.recipe-modal__ingredient-selector').as('ingredientSelector')
      .click();
    verifySelectorRow(recipe.ingredients[0]);

    cy.get('.recipe-modal__ingredients').as('ingredients')
      .click();
    cy.get('@ingredients')
      .contains(/no.*items/i).should('exist');

    for (const ingredient of recipe.ingredients) {
      toggleIngredient(ingredient);
    }

    verifySummary(recipe.ingredients.reduce((summary, nextItem) => {
      const { calories, carbs, protein, fat } = nextItem.food.nutrients;
      summary.calories += calories;
      summary.carbs += carbs;
      summary.protein += protein;
      summary.fat += fat;
      return summary;
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 }));

    for (const ingredient of recipe.ingredients) {
      changeAmount(ingredient, ingredient.amount);
    }

    verifySummary(recipe.ingredients.reduce((summary, nextItem) => {
      const multiplier = nextItem.amount / nextItem.food.serving.value;
      const { calories, carbs, protein, fat } = nextItem.food.nutrients;
      summary.calories += calories * multiplier;
      summary.carbs += carbs * multiplier;
      summary.protein += protein * multiplier;
      summary.fat += fat * multiplier;
      return summary;
    }, { calories: 0, carbs: 0, protein: 0, fat: 0 }));

    for (const ingredient of recipe.ingredients) {
      toggleIngredient(ingredient);
    }
    cy.get('@ingredients')
      .contains(/no.*items/i).should('exist');
    cy.get('@summary')
      .scrollIntoView()
      .contains(/add.*ingredients/i).should('be.visible');
  });

  // it('User should be able to create a recipe', () => {
  //   const foods = mocks.foods(user.id);
  //   const recipe = mocks.recipe(user.id, foods);
  //   stubs['health/dietItems'](user, { foods })
  //     .visit('/health/diet?selected=new-recipe');

  //   const ingredient = recipe.ingredients[0];
  //   cy.get('input[name="name"]')
  //     .type(recipe.name);
  //   cy.get('input[name="description"')
  //     .type(recipe.description);
  //   cy.get('input[name="servingValue"')
  //     .type(recipe.serving.value);
  //   cy.get('.recipe-modal__form__serving__unit .v-select__slot')
  //     .click();
  //   cy.get('.v-menu__content')
  //     .contains(recipe.serving.unit)
  //     .click();
  //   cy.get('.recipe-modal__ingredient-selector').as('ingredientSelector')
  //     .click();
  // });
});

function toggleIngredient ({ food }) {
  return cy.get('.recipe-modal__ingredient-selector').contains(food.name)
    .click();
}

function changeAmount ({ food }, value) {
  cy.get('.recipe-modal__ingredients')
    .contains(food.name).parents('tr').find('.diet-table__table__amount-display')
    .scrollIntoView()
    .click();
  return cy.get(`input[name="amount"][data-id="${food.id}"]`)
    .scrollIntoView()
    .clear().type(`${value}{enter}`);
}

function verifySelectorRow ({ food }) {
  cy.get('@ingredientSelector').contains(food.name).parents('tr')
    .as('selectorRow').contains(parseFloat(food.serving.value).toFixed(2))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(parseFloat(food.nutrients.calories).toFixed(2))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(parseFloat(food.nutrients.carbs).toFixed(2))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(parseFloat(food.nutrients.protein).toFixed(2))
    .scrollIntoView().should('be.visible');
  cy.get('@selectorRow').contains(parseFloat(food.nutrients.fat).toFixed(2))
    .scrollIntoView().should('be.visible');
}

function verifySummary (summary) {
  const { calories, carbs, protein, fat } = summary;
  cy.get('.recipe-modal__summary').as('summary')
    .scrollIntoView()
    .contains(parseFloat(calories).toFixed(2)).should('be.visible');
  cy.get('@summary')
    .contains(parseFloat(carbs).toFixed(2)).should('be.visible');
  cy.get('@summary')
    .contains(parseFloat(protein).toFixed(2)).should('be.visible');
  cy.get('@summary')
    .contains(parseFloat(fat).toFixed(2)).should('be.visible');

  const total = carbs + protein + fat;
  cy.get('@summary')
    .contains(`${parseFloat(carbs / total * 100).toFixed(2)} %`).should('be.visible');
  cy.get('@summary')
    .contains(`${parseFloat(protein / total * 100).toFixed(2)} %`).should('be.visible');
  cy.get('@summary')
    .contains(`${parseFloat(fat / total * 100).toFixed(2)} %`).should('be.visible');
}
