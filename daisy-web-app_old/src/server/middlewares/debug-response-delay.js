const { DEBUG_RESPONSE_DELAY } = require('../../../env.config');

module.exports = () => (req, res, next) => setTimeout(next, DEBUG_RESPONSE_DELAY);
