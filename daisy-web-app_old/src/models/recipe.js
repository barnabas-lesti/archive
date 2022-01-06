import _ from 'lodash';

import Nutrients from './nutrients';

class Recipe {
  constructor (skeleton = {}) {
    const {
      _id,
      content = {},
      items = [],
      summary = new Nutrients(),
    } = _.cloneDeep(skeleton);

    this._id = _id;
    this.content = content;
    this.items = items;
    this.summary = summary;
  }
}

Recipe.getNutrientSummary = (recipe) => {
  const summary = new Nutrients();

  for (const item of recipe.items) {
    const { value: servingValue } = item.serving;
    const { calories, carbs, protein, fat } = item.food.nutrients;
    summary.calories.value += calories.servingMultiplier * servingValue;
    summary.carbs.value += carbs.servingMultiplier * servingValue;
    summary.protein.value += protein.servingMultiplier * servingValue;
    summary.fat.value += fat.servingMultiplier * servingValue;
  }

  const totalNutrients = summary.carbs.value + summary.protein.value + summary.fat.value;
  summary.carbs.percentage = summary.carbs.value / totalNutrients * 100 || 0;
  summary.protein.percentage = summary.protein.value / totalNutrients * 100 || 0;
  summary.fat.percentage = summary.fat.value / totalNutrients * 100 || 0;

  summary.calories.servingMultiplier = summary.calories.value;
  summary.carbs.servingMultiplier = summary.carbs.value;
  summary.protein.servingMultiplier = summary.protein.value;
  summary.fat.servingMultiplier = summary.fat.value;

  return summary;
};

export default Recipe;
