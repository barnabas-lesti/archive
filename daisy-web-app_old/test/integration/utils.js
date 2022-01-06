const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const faker = require('faker');

const { BASE_URL, TEMP_FOLDER_PATH } = require('../../env.config');

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});

const sortArrayOfObjects = (array, key) => {
  return array.sort((a, b) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0;
  });
};

const readEmailFile = async (email, type, locale) => {
  const emailFolderPath = path.join(TEMP_FOLDER_PATH, './email');
  const content = await fs.readFile(path.join(emailFolderPath, `${email}_${type}_${locale}.html`), 'utf-8');
  return content;
};

const createFakeUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  nickname: faker.name.findName(),
});

const createFakeIngredient = (creatorId = '') => ({
  content: {
    name: faker.random.words(),
    description: faker.lorem.sentence(),
  },
  nutrients: {
    calories: { value: faker.random.number(999) },
    carbs: { value: faker.random.number(999) },
    fat: { value: faker.random.number(999) },
    protein: { value: faker.random.number(999) },
  },
  serving: {
    unit: faker.random.arrayElement([ 'g', 'ml' ]),
    value: faker.random.number(999),
  },
  creator: creatorId,
});

module.exports = {
  http,

  sortArrayOfObjects,
  readEmailFile,

  createFakeUser,
  createFakeIngredient,
};
