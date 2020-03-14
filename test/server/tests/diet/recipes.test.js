const { agent, expect, config, data } = require('../../index');

const BASE_URL = '/api/diet/recipes';

describe('Diet / Recipes', () => {
  let authHeader;
  let user;

  const getUser = () => user;
  const getAuthHeader = () => authHeader;
  const authWrapper = (request, auth) => request.set(config.AUTH_HEADER, auth ? getAuthHeader() : '');
  const getMany = ({ auth = true } = {}) => authWrapper(agent().get(BASE_URL), auth);
  const put = ({ auth = true } = {}) => authWrapper(agent().put(BASE_URL), auth);
  const getOne = (id, { auth = true } = {}) => authWrapper(agent().get(`${BASE_URL}/${id}`), auth);
  const patch = (id, { auth = true } = {}) => authWrapper(agent().patch(`${BASE_URL}/${id}`), auth);
  const del = (id, { auth = true } = {}) => authWrapper(agent().delete(`${BASE_URL}/${id}`), auth);

  beforeEach(async () => {
    await data.common.cleanDb();
    ({ user, authHeader } = await data.auth.createAndSignInUser());
    const otherUser = await data.auth.createAndSaveUser();
    await data.diet.createAndSaveRecipes(otherUser.id);
  });

  describe(BASE_URL, () => {
    describe('PUT', () => {
      it('Should return 200, create and return a new recipe', async () => {
        const user = getUser();
        const newRecipe = await data.diet.createRecipe(user.id);

        const { status, body } = await put().send(newRecipe);
        const expectedRecipe = { ...newRecipe, id: body.id, userId: user.id };
        expect(status).to.equal(200);
        verifyFields(body, expectedRecipe);
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await put({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });

    describe('GET', () => {
      it('Should return 200 and the users list of recipes', async () => {
        const numberOfRecipes = 5;
        const user = getUser();
        const recipesInDb = await data.diet.createAndSaveRecipes(user.id, numberOfRecipes);

        const { status, body } = await getMany().send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(numberOfRecipes);
        for (let i = 0; i < body.length; i++) {
          verifyFields(body[i], recipesInDb[i]);
        }
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await getMany({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });
  });

  describe(`${BASE_URL}/:id`, () => {
    describe('GET', () => {
      it('Should return a recipe with foods populated', async () => {
        const user = getUser();
        const recipe = await data.diet.createAndSaveRecipe(user.id);

        const { status, body } = await getOne(recipe.id).send();
        expect(status).to.equal(200);
        verifyFields(body, recipe);
      });

      commonSingle4xxTests(getOne);
    });

    describe('PATCH', () => {
      it('Should update the specified recipe', async () => {
        const user = getUser();
        const recipe = await data.diet.createAndSaveRecipe(user.id);
        const update = await data.diet.createRecipe(user.id);

        const { status, body } = await patch(recipe.id).send(update);
        const expectedRecipe = { ...update, id: recipe.id, userId: user.id };
        expect(status).to.equal(200);
        verifyFields(body, expectedRecipe);
      });

      commonSingle4xxTests(patch);
    });

    describe('DELETE', () => {
      it('Should delete a recipe', async () => {
        const user = getUser();
        const recipe = await data.diet.createAndSaveRecipe(user.id);

        const { status } = await del(recipe.id).send();
        expect(status).to.equal(200);
        const recipeInDb = (await data.diet.findRecipes({ _id: recipe.id }))[0];
        expect(recipeInDb).to.not.exist;
      });

      commonSingle4xxTests(del);
    });
  });
});

function commonSingle4xxTests (request) {
  it('Should return 401 if user is not signed in', async () => {
    const { status, body } = await request('', { auth: false }).send();
    expect(status).to.equal(401);
    expect(body.error).to.equal('UNAUTHORIZED');
  });

  it('Should return 404 if recipe is not found', async () => {
    const recipeId = data.common.randomId();
    const { status, body } = await request(recipeId).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });

  it('Should return 404 if recipe exists but is not created by the user', async () => {
    const notOurUserId = data.common.randomId();
    const recipe = await data.diet.createAndSaveRecipe(notOurUserId);

    const { status, body } = await request(recipe.id).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });
}

function verifyFields (actual, expected) {
  expect(actual._id).to.be.undefined;
  expect(actual.id).to.equal(expected.id);
  expect(actual.name).to.equal(expected.name);
  expect(actual.description).to.equal(expected.description);

  expect(actual.serving.unit).to.equal(expected.serving.unit);
  expect(actual.serving.value).to.equal(expected.serving.value);

  expect(actual.ingredients[0]._id).to.be.undefined;
  expect(actual.ingredients[0].id).to.equal(expected.ingredients[0].id);
  expect(actual.ingredients[0].name).not.to.be.undefined;
  expect(actual.ingredients[0].name).to.equal(expected.ingredients[0].name);
  expect(actual.ingredients[0].amount).not.to.be.undefined;
  expect(actual.ingredients[0].amount).to.equal(expected.ingredients[0].amount);
}
