const jwt = require('jsonwebtoken');

const { AUTH_SECRET } = require('../../../env.config');

module.exports = () => async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const [ , accessToken ] = authHeader.split('Bearer ');

  if (accessToken) {
    try {
      const { iat, exp, ...user } = await jwt.verify(accessToken, AUTH_SECRET);
      req.user = user;
    } catch (jwtError) {}
  }

  return next();
};
