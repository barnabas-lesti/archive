<template lang="pug">
  v-card.base-nutrition-summary(flat)
    v-list.light-blue.lighten-5(dense)
      v-list-tile
        v-list-tile-content.font-weight-bold {{ $t('nutrients.calories') }}
        v-list-tile-content.font-weight-bold.align-end {{ model.calories.value | twoDecimal }} {{ $t('units.kcal') }}
      v-divider
      v-list-tile
        v-list-tile-content {{ $t('nutrients.carbs') }}
        v-list-tile-content.align-end {{ model.carbs.value | twoDecimal }} {{ $t('units.g') }} (~{{ model.carbs.percentage | floor }}%)
      v-divider
      v-list-tile
        v-list-tile-content {{ $t('nutrients.protein') }}
        v-list-tile-content.align-end {{ model.protein.value | twoDecimal }} {{ $t('units.g') }} (~{{ model.protein.percentage | floor }}%)
      v-divider
      v-list-tile
        v-list-tile-content {{ $t('nutrients.fat') }}
        v-list-tile-content.align-end {{ model.fat.value | twoDecimal }} {{ $t('units.g') }} (~{{ model.fat.percentage | floor }}%)
</template>

<script>
export default {
  name: 'BaseNutritionSummary',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
};
</script>

<i18n>
en:
  nutrients:
    calories: Calories
    carbs: Carbs
    fat: Fat
    protein: Protein
  units:
    g: g
    kcal: kcal
</i18n>
