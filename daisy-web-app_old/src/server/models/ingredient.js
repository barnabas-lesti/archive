const mongoose = require('mongoose');

const valueDescription = {
  default: 0,
  type: Number,
};

const nutrientDescription = {
  value: valueDescription,
};

const ingredientSchema = new mongoose.Schema({
  content: {
    description: {
      trim: true,
      type: String,
    },
    name: {
      trim: true,
      type: String,
    },
  },
  nutrients: {
    calories: nutrientDescription,
    carbs: nutrientDescription,
    fat: nutrientDescription,
    protein: nutrientDescription,
  },
  serving: {
    unit: {
      default: 'g',
      type: String,
    },
    value: valueDescription,
  },
  creator: {
    ref: 'User',
    type: mongoose.SchemaTypes.ObjectId,
  },
}, {
  id: false,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: {
    versionKey: false,
    virtuals: true,
  },
});

for (const nutrientKey of Object.keys(ingredientSchema.obj.nutrients)) {
  ingredientSchema.virtual(`nutrients.${nutrientKey}.servingMultiplier`).get(function () {
    const servingValue = this.serving.value;
    return servingValue === 0 ? 0 : this.nutrients[nutrientKey].value / servingValue;
  });
}

module.exports = mongoose.model('Ingredient', ingredientSchema);
