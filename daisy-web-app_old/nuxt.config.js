const envConfig = require('./env.config');

module.exports = {
  mode: 'universal',
  srcDir: './src',

  loading: '~/components/base/base-loader.vue',

  server: {
    port: envConfig.PORT,
  },

  dev: !envConfig.IS_PRODUCTION,

  head: {
    titleTemplate: '%s | Daisy',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },

  env: {
    baseUrl: envConfig.BASE_URL,
  },

  plugins: [
    'plugins/utils',
    'plugins/filters',
    'plugins/logger',
    'plugins/i18n',
    'plugins/auth',
  ],

  modules: [
    '@nuxtjs/sentry',
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
    'cookie-universal-nuxt',
  ],

  axios: {
    baseURL: envConfig.BASE_URL,
  },

  sentry: {
    dsn: envConfig.SENTRY_DSN,
  },

  vuetify: {
    materialIcons: true,
    treeShake: envConfig.IS_PRODUCTION,
  },

  router: {
    middleware: [
      'auth',
      'i18n',
    ],
  },

  build: {
    extend (config) {
      config.module.rules.push(
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loaders: [
            '@kazupon/vue-i18n-loader',
            'yaml-loader',
          ],
        },
      );
    },
  },
};
