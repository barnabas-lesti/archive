export const state = () => ({
  isLoading: false,
});

export const mutations = {
  startLoading (state) { state.isLoading = true; },
  finishLoading (state) { state.isLoading = false; },
};
