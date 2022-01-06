const { expect, agent } = require('../../index');

const url = '/api';

const get = () => agent().get(url);

describe(url, () => {
  beforeEach(async () => {
    // await data.users.removeUsers();
  });

  describe('GET', () => {
    it('Should have status 200', async () => {
      const { status } = await get().send();
      expect(status).to.equal(200);
    });
  });
});
