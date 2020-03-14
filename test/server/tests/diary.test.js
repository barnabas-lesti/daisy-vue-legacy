const { agent, expect, config, data } = require('../index');

const BASE_URL = '/api/diary';

describe('Diary', () => {
  let authHeader;
  let user;

  const getUser = () => user;
  const getAuthHeader = () => authHeader;
  const authWrapper = (request, auth) => request.set(config.AUTH_HEADER, auth ? getAuthHeader() : '');
  const getMany = ({ auth = true } = {}) => authWrapper(agent().get(BASE_URL), auth);
  const put = ({ auth = true } = {}) => authWrapper(agent().put(BASE_URL), auth);
  const getOne = (dateString, { auth = true } = {}) => authWrapper(agent().get(`${BASE_URL}/${dateString}`), auth);
  const patch = (dateString, { auth = true } = {}) => authWrapper(agent().patch(`${BASE_URL}/${dateString}`), auth);
  const del = (dateString, { auth = true } = {}) => authWrapper(agent().delete(`${BASE_URL}/${dateString}`), auth);

  beforeEach(async () => {
    await data.common.cleanDb();
    ({ user, authHeader } = await data.auth.createAndSignInUser());
  });

  describe(BASE_URL, () => {
    describe('PUT', () => {
      it('Should create and return a new item', async () => {
        const user = getUser();
        const newItem = await data.diary.createDiaryItem(user.id);

        const { status, body } = await put().send(newItem);
        expect(status).to.equal(200);
        expect(body.id).not.to.be.undefined;
        const expectedItem = { ...newItem, id: body.id, userId: user.id };
        verifyFields(body, expectedItem);
      });

      it('Should return 400 if item already exists', async () => {
        const user = getUser();
        const existingItem = await data.diary.createAndSaveDiaryItem(user.id);
        const { status, body } = await put().send(existingItem);
        expect(status).to.equal(400);
        expect(body.error).to.equal('ALREADY_EXISTS');
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await put({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });

    describe('GET', () => {
      it('Should return an array of items', async () => {
        const numberOfItems = 5;
        const user = getUser();
        const itemsInDb = await data.diary.createAndSaveDiaryItems(user.id, numberOfItems);

        const { status, body } = await getMany().send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(numberOfItems);
        itemsInDb.forEach(dbItem => {
          const bodyItem = body.filter(item => item.id === dbItem.id)[0];
          verifyFields(bodyItem, dbItem);
        });
      });

      it('Should accept "by-day-of-week" as filter and return items based on this', async () => {
        const inRangeDateStrings = [ '2019-12-30', '2019-12-31', '2020-01-05' ];
        const dateStrings = [ ...inRangeDateStrings, '2018-12-31', '2019-12-29', '2020-01-06', '2019-01-01' ];
        const user = getUser();
        const itemsInDb = await data.diary.createAndSaveDiaryItems(user.id, null, dateStrings);
        const subjects = itemsInDb.filter(item => inRangeDateStrings.indexOf(item.dateString) !== -1);

        const { status, body } = await getMany()
          .query({ 'by-day-of-week': inRangeDateStrings[0] })
          .send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(inRangeDateStrings.length);
        subjects.forEach(subject => {
          const actual = body.filter(item => item.id === subject.id)[0];
          verifyFields(actual, subject);
        });
      });

      it('Should accept "by-year-month" as filter and return items based on this', async () => {
        const inRangeDateStrings = [ '2020-01-03', '2020-01-11' ];
        const dateStrings = [ ...inRangeDateStrings, '2019-05-10', '2030-10-12' ];
        const user = getUser();
        const itemsInDb = await data.diary.createAndSaveDiaryItems(user.id, null, dateStrings);
        const subjects = itemsInDb.filter(item => inRangeDateStrings.indexOf(item.dateString) !== -1);

        const { status, body } = await getMany()
          .query({ 'by-year-month': data.common.moment(inRangeDateStrings[0], config.DATE_FORMAT).format('YYYY-MM') })
          .send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(inRangeDateStrings.length);
        subjects.forEach(subject => {
          const actual = body.filter(item => item.id === subject.id)[0];
          verifyFields(actual, subject);
        });
      });

      it('Should accept "by-date-strings" as filter and return items based on this', async () => {
        const dateStrings = [ '2019-05-10', '2020-01-03', '2020-01-11', '2030-10-12' ];
        const additionalDateStrings = [ '2018-01-03', '2031-02-20' ];
        const user = getUser();
        const itemsInDb = await data.diary
          .createAndSaveDiaryItems(user.id, null, [ ...dateStrings, ...additionalDateStrings ]);

        const { status, body } = await getMany()
          .query({ 'by-date-strings': dateStrings })
          .send();
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body.length).to.equal(dateStrings.length);
        body.forEach(actual => {
          const subject = itemsInDb.filter(item => item.id === actual.id)[0];
          verifyFields(actual, subject);
        });
      });

      it('Should return 401 if user is not signed in', async () => {
        const { status, body } = await getMany({ auth: false }).send();
        expect(status).to.equal(401);
        expect(body.error).to.equal('UNAUTHORIZED');
      });
    });
  });

  describe(`${BASE_URL}/:dateString`, () => {
    describe('GET', () => {
      it('Should return a populated diary item', async () => {
        const user = getUser();
        const item = await data.diary.createAndSaveDiaryItem(user.id);

        const { status, body } = await getOne(item.dateString).send();
        expect(status).to.equal(200);
        verifyFields(body, item);
      });

      commonSingle4xxTests(getOne);
    });

    describe('PATCH', () => {
      it('Should update the specified item', async () => {
        const user = getUser();
        const item = await data.diary.createAndSaveDiaryItem(user.id);
        const update = await data.diary.createDiaryItem(user.id);

        const { status, body } = await patch(item.dateString).send(update);
        const expectedItem = { ...update, id: item.id, date: item.date, dateString: item.dateString, userId: user.id };
        expect(status).to.equal(200);
        verifyFields(body, expectedItem);
      });

      commonSingle4xxTests(patch);
    });

    describe('DELETE', () => {
      it('Should delete a diary item', async () => {
        const user = getUser();
        const item = await data.diary.createAndSaveDiaryItem(user.id);

        const { status } = await del(item.dateString).send();
        expect(status).to.equal(200);
        const itemInDb = (await data.diary.findDietItems({ _id: item.id }))[0];
        expect(itemInDb).to.not.exist;
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

  it('Should return 404 if item is not found', async () => {
    const dateString = data.diary.dateString();
    const { status, body } = await request(dateString).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });

  it('Should return 404 if item exists but is not created by the user', async () => {
    const notOurUserId = data.common.randomId();
    const item = await data.diary.createAndSaveDiaryItem(notOurUserId);

    const { status, body } = await request(item.id).send();
    expect(status).to.equal(404);
    expect(body.error).to.equal('NOT_FOUND');
  });
}

function verifyFields (actual, expected) {
  expect(actual.id).to.equal(expected.id);
  expect(actual.userId).to.equal(expected.userId);
  expect(actual.summary).to.equal(expected.summary);
  expect(new Date(actual.date).toString()).to.equal(new Date(expected.date).toString());
  expect(actual.dateString).to.equal(expected.dateString);

  expected.items.forEach(expectedItem => {
    const actualItem = actual.items.filter(item => item.id === expectedItem.id)[0];
    expect(actualItem.itemType).to.equal(expectedItem.itemType);
    expect(actualItem.amount).to.equal(expectedItem.amount);
    expect(actualItem.name).to.equal(expectedItem.name);

    if (expectedItem.itemType === 'Recipe') {
      const { ingredients } = expectedItem;
      (ingredients || []).forEach(expectedIngredient => {
        const actualIngredient = actualItem.ingredients.filter(({ id }) => id === expectedIngredient.id)[0];
        expect(actualIngredient.name).not.to.be.undefined;
        expect(actualIngredient.name).to.equal(expectedIngredient.name);
        expect(actualIngredient.nutrients.calories).to.equal(expectedIngredient.nutrients.calories);
      });
    }
  });
}
