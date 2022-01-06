const app = require('../../src/server/app');

beforeAll(async () => {
  await app.start();
});

afterAll(async () => {
  await app.stop();
});
