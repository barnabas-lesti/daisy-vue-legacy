/* eslint no-console: 0 */

const express = require('express');
const axios = require('axios').default;

const config = require('../src/server/config');
const data = require('../test/server/data');

const NUMBER_OF_FOODS = 15;
const NUMBER_OF_RECIPES = 5;
const NUMBER_OF_DIARY_ITEMS = 10;
const MAX_NUMBER_OF_SUB_ITEMS = 5;
const DATE_RANGE_END = data.common.moment().format(config.DATE_FORMAT);

const http = axios.create({
  baseURL: config.env.BASE_URL,
});

const app = express();
const server = app.listen(6000, async () => {
  const { user, authHeader } = await createAndSignInUser();
  const foods = await createFoods(user, authHeader);
  const recipes = await createRecipes(user, authHeader, foods);
  await createDiaryItems(user, authHeader, [ ...foods, ...recipes ]);

  server.close();
});

async function createAndSignInUser () {
  const user = await data.auth.createUser();
  await http.put('/api/auth/register', user);
  const { data: { authHeader } } = await http.post('/api/auth/sign-in', user);
  console.log('=== USER ==========================');
  console.log(`user.email: ${user.email}`);
  console.log(`user.password: ${user.password}`);
  console.log(`authHeader: ${authHeader}`);
  return { user, authHeader };
}

async function createFoods (user, authHeader) {
  const promises = [];
  for (let i = 0; i < NUMBER_OF_FOODS; i++) {
    const food = data.diet.createFood(user.id);
    const headers = { 'authorization': authHeader };
    const request = http.put('/api/diet/foods', food, { headers });
    promises.push(request);
  }
  const foods = (await Promise.all(promises)).map(({ data }) => data);
  console.log('=== FOOD ==========================');
  console.log(`createdFood.length: ${foods.length}`);
  return foods;
}

async function createRecipes (user, authHeader, foods) {
  const promises = [];
  for (let i = 0; i < NUMBER_OF_RECIPES; i++) {
    const numberOfIngredients = data.common.faker.random.number(MAX_NUMBER_OF_SUB_ITEMS) + 1;
    const foodsToAddToRecipe = [];
    while (foodsToAddToRecipe.length < numberOfIngredients) {
      const food = foods[data.common.faker.random.number(foods.length - 1)];
      if (!foodsToAddToRecipe.filter(item => item.id === food.id).length) {
        foodsToAddToRecipe.push(food);
      }
    }

    const recipe = await data.diet.createRecipe(user.id, foodsToAddToRecipe);
    const headers = { 'authorization': authHeader };
    const request = http.put('/api/diet/recipes', recipe, { headers });
    promises.push(request);
  }
  const recipes = (await Promise.all(promises)).map(({ data }) => data);
  console.log('=== RECIPES =======================');
  console.log(`createdRecipes.length: ${recipes.length}`);
  return recipes;
}

async function createDiaryItems (user, authHeader, dietItems) {
  const promises = [];
  for (let i = 0; i < NUMBER_OF_DIARY_ITEMS; i++) {
    const numberOfDietItems = data.common.faker.random.number(MAX_NUMBER_OF_SUB_ITEMS) + 1;
    const dietItemsToAddToDiaryItem = [];
    while (dietItemsToAddToDiaryItem.length < numberOfDietItems) {
      const dietItem = dietItems[data.common.faker.random.number(dietItems.length - 1)];
      if (!dietItemsToAddToDiaryItem.filter(item => item.id === dietItem.id).length) {
        dietItemsToAddToDiaryItem.push(dietItem);
      }
    }

    const dateString = data.common.moment(DATE_RANGE_END).subtract(i, 'days').format(config.DATE_FORMAT);
    const diaryItem = await data.diary.createDiaryItem(user.id, dietItemsToAddToDiaryItem, dateString);
    const headers = { 'authorization': authHeader };
    const request = http.put('/api/diary', diaryItem, { headers });
    promises.push(request);
  }

  const diaryItems = (await Promise.all(promises)).map(({ data }) => data);
  const dateStrings = diaryItems.map(item => item.dateString);
  console.log('=== DIARY =======================');
  console.log(`createdDiaryItems.length: ${diaryItems.length}`);
  console.log(`dateRange: ${dateStrings[dateStrings.length - 1]} >> ${dateStrings[0]}`);
  return diaryItems;
}
