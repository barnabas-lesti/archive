class Nutrients {
  constructor (skeleton = {}) {
    this.calories = skeleton.calories || { value: 0, unit: 'kcal', servingMultiplier: 0 };
    this.energy = skeleton.energy || { value: 0, unit: 'kj', servingMultiplier: 0 };
    this.carbs = skeleton.carbs || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.fat = skeleton.fat || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.fiber = skeleton.fiber || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.protein = skeleton.protein || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.salt = skeleton.salt || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.saturatedFat = skeleton.saturatedFat || { value: 0, unit: 'g', servingMultiplier: 0 };
    this.sugar = skeleton.sugar || { value: 0, unit: 'g', servingMultiplier: 0 };
  };
}

export default Nutrients;
