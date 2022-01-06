const consola = require('consola').withScope('daisy:api');
const Sentry = require('@sentry/node');

const { SENTRY_DSN } = require('../../../env.config');

if (SENTRY_DSN) {
  Sentry.init({ SENTRY_DSN });
  consola.success('SENTRY_DSN set, logging API errors to Sentry');
} else {
  consola.info('SENTRY_DSN not set, will not log API errors to Sentry');
}

class Logger {
  success (message, ...options) { consola.success({ message, ...options }); }
  log (message, ...options) { consola.log({ message, ...options }); }
  info (message, ...options) { consola.info({ message, ...options }); }
  error (error, ...options) {
    Sentry.captureException(error);
    consola.error({ message: error, ...options });
  }
}

module.exports = new Logger();
