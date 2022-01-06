import Vue from 'vue';

const filters = {
  floor: value => Math.floor(value),
  twoDecimal: value => Math.round(value * 100) / 100,
};

for (const filterName of Object.keys(filters)) {
  Vue.filter(filterName, filters[filterName]);
}
