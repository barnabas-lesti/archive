import Notification from '../models/notification';

export const state = () => ({
  notification: null,
});

export const mutations = {
  showInfo (state, payload) {
    state.notification = new Notification(Notification.Types.INFO, payload);
  },
  showSuccess (state, payload) {
    state.notification = new Notification(Notification.Types.SUCCESS, payload);
  },
  showError (state, payload) {
    state.notification = new Notification(Notification.Types.ERROR, payload);
  },
  clear (state) {
    state.notification = null;
  },
};
