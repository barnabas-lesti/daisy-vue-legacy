const { agent, expect } = require('../core');
const { cleanDb, createFakeItem, fetchItemFromDb, fetchItemsFromDb, populateDb } = require('./utils');

const BASE_URL = '/api/wallet/items';

describe(BASE_URL, () => {
  const get = () => agent().get(BASE_URL);
  const put = () => agent().put(BASE_URL);

  beforeEach(async () => {
    await cleanDb();
    await populateDb();
  });

  describe('GET', () => {
    it('Should return a list of items', async () => {
      const createdItems = await fetchItemsFromDb();
      const [ createdItem ] = createdItems;
      const { status, body } = await get().send();
      const responseItem = body.filter(item => item.name === createdItem.name)[0];

      expect(status).to.equal(200);
      expect(body).to.be.an('array');
      expect(body.length).to.equal(createdItems.length);
      expect(responseItem).to.not.be.undefined;
      expect(responseItem.id).to.not.be.undefined;
      expect(responseItem._id).to.be.undefined;
    });
  });

  describe('PUT', () => {
    it('Should create a new item', async () => {
      const newItem = createFakeItem();
      const { status, body } = await put().send(newItem);

      expect(status).to.equal(200);
      expect(body).to.not.be.undefined;
      expect(body.id).to.not.be.undefined;
      expect(body._id).to.be.undefined;
      expect(body.name).to.equal(newItem.name);
      expect(body.value).to.equal(newItem.value);
    });
  });
});

describe(`${BASE_URL}/:id`, () => {
  const url = (id) => `${BASE_URL}/${id}`;
  const get = (id) => agent().get(url(id));
  const patch = (id) => agent().patch(url(id));
  const del = (id) => agent().del(url(id));

  beforeEach(async () => {
    await cleanDb();
    await populateDb();
  });

  describe('GET', () => {
    it('Should return an item', async () => {
      const [ createdItem ] = await fetchItemsFromDb();
      const { status, body } = await get(createdItem.id).send();

      expect(status).to.equal(200);
      expect(body).to.not.be.undefined;
      expect(body.id).to.not.be.undefined;
      expect(body._id).to.be.undefined;
      expect(body.name).to.equal(createdItem.name);
      expect(body.value).to.equal(createdItem.value);
    });
  });

  describe('PATCH', () => {
    it('Should update an item', async () => {
      const { value, ...update } = createFakeItem();
      const [ createdItem ] = await fetchItemsFromDb();
      const { status, body } = await patch(createdItem.id).send(update);
      const updatedItemInDb = await fetchItemFromDb(createdItem.id);

      expect(status).to.equal(200);
      expect(body.id).to.not.be.undefined;
      expect(body._id).to.be.undefined;
      expect(body.name).to.equal(update.name);
      expect(body.value).to.equal(createdItem.value);
      expect(updatedItemInDb.name).to.equal(update.name);
      expect(updatedItemInDb.value).to.equal(createdItem.value);
    });
  });

  describe('DELETE', () => {
    it('Should delete an item', async () => {
      const [ createdItem ] = await fetchItemsFromDb();
      const { status, body } = await del(createdItem.id).send();
      const itemInDb = await fetchItemFromDb(createdItem.id);

      expect(status).to.equal(200);
      expect(body).to.be.empty;
      expect(itemInDb).to.be.null;
    });
  });
});
