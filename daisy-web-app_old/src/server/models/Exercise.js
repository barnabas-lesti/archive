const mongoose = require('mongoose');

const valueDescription = {
  default: 0,
  type: Number,
};

const exerciseSchema = new mongoose.Schema({
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
  calorieBurn: {
    value: valueDescription,
  },
  duration: {
    value: valueDescription,
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

exerciseSchema.virtual('calorieBurn.durationMultiplier').get(function () {
  const duration = this.duration.value;
  return duration === 0 ? 0 : this.calorieBurn.value / duration;
});

module.exports = mongoose.model('Exercise', exerciseSchema);
