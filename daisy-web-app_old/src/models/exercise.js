import _ from 'lodash';

export default class Exercise {
  constructor (skeleton = {}) {
    const {
      _id,
      content = {},
      calorieBurn = {},
      duration = {},
    } = _.cloneDeep(skeleton);

    this._id = _id;
    this.content = content;
    this.calorieBurn = calorieBurn;
    this.duration = duration;
  }
}
