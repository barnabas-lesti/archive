export const state = () => ({
  items: [],
});

export const mutations = {
  setItems (state, items) {
    state.items = items;
  },
  addItems (state, items) {
    state.items.push(...items.filter(item => state.items.map(item => item._id).indexOf(item._id) === -1));
  },
  removeItems (state, items) {
    state.items = state.items.filter(item => items.map(item => item._id).indexOf(item._id) === -1);
  },
};
