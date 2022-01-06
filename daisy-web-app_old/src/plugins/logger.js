import consola from 'consola';
import Vue from 'vue';

const consolaWithScope = consola.withScope('daisy:web');

class Logger {
  constructor ($sentry) {
    this.$sentry = $sentry;
  }

  error (error, ...options) {
    this.$sentry && this.$sentry.captureException(error);
    consolaWithScope.error({ message: error, ...options });
  }
}

export default (context) => {
  Vue.prototype.$logger = context.$logger = new Logger(context.app.$sentry);
};
