const express = require('express');
const bodyParser = require('body-parser');

const config = require('./common/config');
const logger = require('./common/logger');

const coreService = require('./services/core-service');
const routerService = require('./services/router-service');
const timerService = require('./services/timer-service');

const app = express();

(async () => {
  const timerInstance = timerService.createTimer();
  logger.info(`Using configuration: "${config.NODE_ENV}"`);

  app.use('*', [
    bodyParser.json(),
    require('./middlewares/config')(),
  ]);

  routerService.initializeRoutes(app);

  await coreService.createTempFolder();
  await coreService.connectToMongoDb();

  const server = await app.listen(config.PORT);
  const { address } = server.address();
  logger.info(`Server running at http://${address}:${config.PORT} (${timerInstance.finish()}ms)`);
})();

module.exports = app;
