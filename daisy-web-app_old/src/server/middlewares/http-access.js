const basicAuth = require('express-basic-auth');

const { AUTH_HTTP_ACCESS_USERNAME, AUTH_HTTP_ACCESS_PASSWORD } = require('../../../env.config');

module.exports = () => basicAuth({
  challenge: true,
  users: { [AUTH_HTTP_ACCESS_USERNAME]: AUTH_HTTP_ACCESS_PASSWORD },
});
