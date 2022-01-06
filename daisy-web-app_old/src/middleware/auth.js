export default async ({ $axios, $logger, store, app: { $cookies } }) => {
  if (store.state.user.user) return;

  const accessToken = $cookies.get('access-token');
  if (!accessToken) return;

  try {
    const user = await $axios.$post('/api/auth/verify-access-token', { token: accessToken });
    store.commit('user/signIn', { user, accessToken });
  } catch (ex) {
    const error = ex.response || ex;
    if (error.status === 401) {
      $cookies.remove('access-token');
    } else {
      $logger.error(error);
    }
  }
};
