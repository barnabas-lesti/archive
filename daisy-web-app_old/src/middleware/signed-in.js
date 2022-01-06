export default ({ store, redirect, route }) => {
  if (!store.state.user.user) {
    return redirect({
      name: 'locale-sign-in',
      query: { 'ref': route.name },
    });
  }
};
