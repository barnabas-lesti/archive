class Notification {
  constructor (type, payload) {
    if (typeof payload === 'string') {
      this.text = payload;
    } else {
      this.text = payload.text;
      this.html = payload.html;
    }
    this.type = type;
  }
}

Notification.Types = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default Notification;
