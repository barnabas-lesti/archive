import Vue from 'vue';

class Utils {
  constructor (context) {
    this._context = context;
  }

  pushRouteQuery (payload) {
    const { route, app: { router } } = this._context;
    router.push({ query: { ...route.query, ...this._normalizeQueryPayload(payload) } });
  }

  _normalizeQueryPayload (payload) {
    const normalizedQuery = {};
    for (const key of Object.keys(payload)) {
      normalizedQuery[key] = payload[key] || undefined;
    }
    return normalizedQuery;
  }
}

export default (context) => {
  const utils = new Utils(context);
  context.$utils = utils;
  Vue.prototype.$utils = utils;
};
