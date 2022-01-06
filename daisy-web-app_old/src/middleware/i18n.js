export default ({ isHMR, params, store, redirect, route, app }) => {
  if (isHMR) return;

  const requestedLocale = params.locale;
  if (store.state.i18n.locales.indexOf(requestedLocale) === -1) {
    redirect({
      name: 'locale',
      params: { locale: app.i18n.fallbackLocale },
      query: { ...route.query },
    });
    return;
  }

  store.commit('i18n/setLocale', requestedLocale);
  app.i18n.locale = requestedLocale;
};
