const { agent, expect, config, data } = require('../../index');

const BASE_URL = '/api/diet/foods';

describe('Diet / Foods', () => {
  let authHeader;
  let user;

  const getUser = () => user;
  const getAuthHeader = () => authHeader;
  const authWrapper = (request, auth) => request.set(config.AUTH_HEADER, auth ? getAuthHeader() : '');
  const getAll = ({ auth = true } = {}) => authWrapper(agent().get(BASE_URL), auth);
  const put = ({ auth = true } = {}) => authWrapper(agent().put(BASE_URL), auth);
  const getOne = (id, { auth = true } = {}) => authWrapper(agent().get(`${BASE_URL}/${id}`), auth);
  const patch = (id, { auth = true } = {}) => authWrapper(agent().patch(`${BASE_URL}/${id}`), auth);
  const del = (id, { auth = true } = {}) => authWrapper(agent().delete(`${BASE_URL}/${id}`), auth);

  beforeEach(async () => {
    await data.common.cleanDb();
    ({ user, authHeader } = await data.auth.createAndSignInUser());
    const otherUser = await data.auth.createAndSaveUser();
    await data.diet.createAndSaveFoods(otherUser.id, 5);
  });

  describe(BASE_URL, () => {
    describe('GET', () => {
      it('Should return 200 and the users list of foods', async () => {
        const numberOfFoods = 8;
        const user = getUser();
        await data.diet.createAndSaveFoods(user.id, numberOfFoods);

        const { status, body } = await getAll().send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(numberOfFoods);
        for (const food of body) {
          expect(food.userId).to.equal(user.id);
        }
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await getAll({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });

    describe('PUT', () => {
      it('Should return 200, create and return a new food', async () => {
        const user = getUser();
        const newFood = data.diet.createFood('shouldNotSaveMe1234');

        const { status, body } = await put().send(newFood);
        const expectedFood = { ...newFood, id: body.id, userId: user.id };
        expect(status).to.equal(200);
        verifyFood(body, expectedFood);
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await put({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });
  });

  describe(`${BASE_URL}/:id`, () => {
    describe('GET', () => {
      it('Should return a food for the user', async () => {
        const user = getUser();
        const food = await data.diet.createAndSaveFood(user.id);

        const { status, body } = await getOne(food.id).send();
        expect(status).to.equal(200);
        expect(body.id).to.equal(food.id);
        expect(body.userId).to.equal(user.id);
        expect(body.name).to.equal(food.name);
      });

      commonSingle4xxTests(getOne);
    });

    describe('PATCH', () => {
      it('Should update the specified food', async () => {
        const user = getUser();
        const food = await data.diet.createAndSaveFood(user.id);
        const update = data.diet.createFood();

        const { status, body } = await patch(food.id).send(update);
        const expectedFood = { ...update, id: food.id, userId: user.id };
        expect(status).to.equal(200);
        verifyFood(body, expectedFood);
      });

      commonSingle4xxTests(patch);
    });

    describe('DELETE', () => {
      it('Should delete the food', async () => {
        const user = getUser();
        const food = await data.diet.createAndSaveFood(user.id);

        const { status } = await del(food.id).send();
        expect(status).to.equal(200);
        const foodInDb = (await data.diet.findFoods({ _id: food.id }))[0];
        expect(foodInDb).to.not.exist;
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

  it('Should return 404 if food is not found', async () => {
    const foodId = data.common.randomId();
    const { status, body } = await request(foodId).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });

  it('Should return 404 if food exists but is not created by the user', async () => {
    const notOurUserId = data.common.randomId();
    const food = await data.diet.createAndSaveFood(notOurUserId);

    const { status, body } = await request(food.id).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });
}

function verifyFood (actual, expectedFood) {
  expect(actual.id).to.equal(expectedFood.id);
  expect(actual.userId).to.equal(expectedFood.userId);
  expect(actual.name).to.equal(expectedFood.name);
  expect(actual.description).to.equal(expectedFood.description);

  expect(actual.serving.unit).to.equal(expectedFood.serving.unit);
  expect(actual.serving.value).to.equal(expectedFood.serving.value);

  expect(actual.nutrients.calories).to.equal(expectedFood.nutrients.calories);
  expect(actual.nutrients.carbs).to.equal(expectedFood.nutrients.carbs);
  expect(actual.nutrients.protein).to.equal(expectedFood.nutrients.protein);
  expect(actual.nutrients.fat).to.equal(expectedFood.nutrients.fat);
}
