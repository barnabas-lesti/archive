import _ from 'lodash';

import Nutrients from './nutrients';
import Recipe from './recipe';

class CalculatorItem {
  constructor (skeleton = {}, type) {
    const {
      _id,
      content = {},
      nutrients = {},
      serving = { value: 0, unit: 'g' },
    } = _.cloneDeep(skeleton);

    this._id = _id;
    this.type = type;
    this.content = content;
    this.serving = serving;
    this.nutrients = new Nutrients(nutrients);
  }
}

CalculatorItem.createFromFood = (food) => {
  const calculatorItem = new CalculatorItem(food, 'food');
  return calculatorItem;
};

CalculatorItem.createFromExercise = (exercise) => {
  const calculatorItem = new CalculatorItem(exercise, 'exercise');
  calculatorItem.serving = { value: exercise.duration.value, unit: 'mins' };
  calculatorItem.nutrients = new Nutrients({
    calories: {
      value: exercise.calorieBurn.value * -1,
      servingMultiplier: (exercise.calorieBurn.durationMultiplier || 0) * -1,
    },
  });
  return calculatorItem;
};

CalculatorItem.createFromRecipe = (recipe) => {
  const calculatorItem = new CalculatorItem(recipe, 'recipe');
  calculatorItem.serving = { value: 1, unit: 'plates' };
  calculatorItem.nutrients = Recipe.getNutrientSummary(recipe);
  return calculatorItem;
};

CalculatorItem.getNutrientSummary = (items) => {
  const summary = new Nutrients();

  for (const item of items) {
    const { value: servingValue } = item.serving;
    const { calories, carbs, protein, fat } = item.nutrients;
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

export default CalculatorItem;
