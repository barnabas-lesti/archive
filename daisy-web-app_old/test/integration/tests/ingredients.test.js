const { User, Ingredient } = require('../../../src/server/models');
const { http, createFakeUser, createFakeIngredient } = require('../utils');

const NUMBER_OF_INGREDIENTS = 10;

let creatorUserDoc;
let notCreatorUserDoc;
let ingredientDocs;
let creatorAccessHeader;
let notCreatorAccessHeader;

describe('ingredients', () => {
  beforeAll(async () => {
    const creatorUser = createFakeUser();
    const notCreatorUser = createFakeUser();
    ([ creatorUserDoc, notCreatorUserDoc ] = await User.create([
      { ...creatorUser, passwordHash: await User.hashPassword(creatorUser.password) },
      { ...notCreatorUser, passwordHash: await User.hashPassword(notCreatorUser.password) },
    ]));

    creatorAccessHeader = { headers: { 'Authorization': `Bearer ${await User.createAccessToken(creatorUserDoc)}` } };
    notCreatorAccessHeader = { headers: { 'Authorization': `Bearer ${await User.createAccessToken(notCreatorUserDoc)}` } };
  });

  beforeEach(async () => {
    const ingredients = [];
    for (let i = 0; i < NUMBER_OF_INGREDIENTS; i++) ingredients.push(createFakeIngredient(creatorUserDoc._id));
    ingredientDocs = await Ingredient.create(ingredients);
  });

  afterEach(async () => {
    await Ingredient.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('PUT /api/ingredients', () => {
    test('should respond with 401 if user is not signed in', async () => {
      try {
        await http.put('/api/ingredients', {});
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 400 if "content.name" is not provided', async () => {
      try {
        const { content, ...newIngredient } = createFakeIngredient();
        await http.put('/api/ingredients', newIngredient, creatorAccessHeader);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 200, create a new ingredient and return it', async () => {
      const newIngredient = createFakeIngredient();
      const { status, data } = await http.put('/api/ingredients', newIngredient, creatorAccessHeader);
      expect(status).toBe(200);
      expect(data).toBeDefined();
      expect(data.content.name).toEqual(newIngredient.content.name);
      expect(data.creator.nickname).toEqual(creatorUserDoc.nickname);
    });
  });

  describe('GET /api/ingredients', () => {
    test('should respond with 200 and return an array of ingredients', async () => {
      const { status, data } = await http.get('/api/ingredients');
      expect(status).toBe(200);
      expect(Array.isArray(data)).toEqual(true);
      expect(data.length).toEqual(ingredientDocs.length);
    });
  });

  describe('GET /api/ingredients/:_id', () => {
    test('should respond with 404 if ingredient is not found', async () => {
      try {
        await http.get(`/api/ingredients/not-a-valid-id-1234`);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should respond with 200 and return an ingredient', async () => {
      const [ ingredientDoc ] = ingredientDocs;
      const { status, data } = await http.get(`/api/ingredients/${ingredientDoc._id}`);
      expect(status).toBe(200);
      expect(data).toBeDefined();
      expect(data.content.name).toEqual(ingredientDoc.content.name);
      expect(data.creator.nickname).toEqual(creatorUserDoc.nickname);
    });
  });

  describe('PATCH /api/ingredients/:_id', () => {
    test('should respond with 401 if user is not signed in', async () => {
      const [ ingredientDoc ] = ingredientDocs;
      try {
        await http.patch(`/api/ingredients/${ingredientDoc._id}`, {});
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 404 if ingredient is not found', async () => {
      try {
        await http.patch('/api/ingredients/not-a-valid-id-1234', {}, creatorAccessHeader);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should respond with 403 if signed in user is not the creator', async () => {
      const [ ingredientDoc ] = ingredientDocs;
      try {
        await http.patch(`/api/ingredients/${ingredientDoc._id}`, {}, notCreatorAccessHeader);
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
    });

    test('should respond with 200 and update an ingredient', async () => {
      const [ { _id } ] = ingredientDocs;
      const patch = { content: { name: 'Patched name' } };
      const { status } = await http.patch(`/api/ingredients/${_id}`, patch, creatorAccessHeader);
      const patchedDoc = await Ingredient.findById(_id);
      expect(status).toBe(200);
      expect(patchedDoc.content.name).toEqual(patch.content.name);
    });
  });

  describe('DELETE /api/ingredients/:_id', () => {
    test('should respond with 401 if user is not signed in', async () => {
      const [ ingredientDoc ] = ingredientDocs;
      try {
        await http.delete(`/api/ingredients/${ingredientDoc._id}`);
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 404 if ingredient is not found', async () => {
      try {
        await http.delete('/api/ingredients/not-a-valid-id-1234', creatorAccessHeader);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should respond with 403 if signed in user is not the creator', async () => {
      const [ ingredientDoc ] = ingredientDocs;
      try {
        await http.delete(`/api/ingredients/${ingredientDoc._id}`, notCreatorAccessHeader);
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
    });

    test('should respond with 200 and delete an ingredient', async () => {
      const [ { _id } ] = ingredientDocs;
      const { status } = await http.delete(`/api/ingredients/${_id}`, creatorAccessHeader);
      expect(status).toBe(200);
      expect(await Ingredient.findById(_id)).toBeNull();
    });
  });
});
