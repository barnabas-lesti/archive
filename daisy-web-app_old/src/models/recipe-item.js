import _ from 'lodash';

import Food from './food';

export default class RecipeItem {
  constructor (skeleton = new Food()) {
    const skeletonClone = _.cloneDeep(skeleton);
    this.serving = {
      value: skeletonClone.serving.value,
      unit: skeletonClone.serving.unit,
    };
    this.food = skeletonClone;
  }
};
