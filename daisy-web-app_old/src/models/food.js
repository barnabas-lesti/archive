import _ from 'lodash';

import Nutrients from './nutrients';

export default class Food {
  constructor (skeleton = {}) {
    const {
      _id,
      content = {},
      nutrients = {},
      serving = { value: 0, unit: 'g' },
    } = _.cloneDeep(skeleton);

    this._id = _id;
    this.content = content;
    this.serving = serving;
    this.nutrients = new Nutrients(nutrients);
  }
}
