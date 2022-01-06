<template lang="pug">
  .recipes-food-selector
    v-data-table.elevation-1(v-if='items.length', v-model='selection', :headers='headers', :items='items', item-key='food._id', hide-actions)
      template(v-slot:items='props')
        tr.recipes-food-selector_row(:class="props.selected ? 'teal lighten-5': ''", @click='props.selected = !props.selected')
          td
            .recipes-food-selector_name.font-weight-bold.text-truncate {{ props.item.food.content.name }}
            .font-italic {{ props.item.food.nutrients.calories.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.kcal') }}
          td.text-xs-right
            v-text-field.recipes-food-selector_serving.pa-2(v-model='props.item.serving.value', :suffix="$t(`units.${props.item.food.serving.unit}`)",
              type='number', hide-details, @click.stop)
          td.text-xs-right
            .recipes-food-selector_nutrition {{ props.item.food.nutrients.carbs.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .recipes-food-selector_nutrition {{ props.item.food.nutrients.protein.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .recipes-food-selector_nutrition {{ props.item.food.nutrients.fat.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
    v-card.pa-4.text-xs-center(v-else)
      slot(name='noData') {{ $t('noDataFallback') }}
</template>

<script>
export default {
  name: 'RecipesFoodSelector',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      headers: [
        { text: this.$t('name'), value: 'food.content.name', align: 'left' },
        { text: this.$t('serving'), value: 'serving.value', align: 'right' },
        { text: this.$t('nutrients.carbs'), value: 'food.nutrients.carbs.value', align: 'right' },
        { text: this.$t('nutrients.protein'), value: 'food.nutrients.protein.value', align: 'right' },
        { text: this.$t('nutrients.fat'), value: 'food.nutrients.fat.value', align: 'right' },
      ],
    };
  },
  computed: {
    selection: {
      get () { return this.value; },
      set (newValue) { this.$emit('input', newValue); },
    },
  },
};
</script>

<style lang="stylus">
.recipes-food-selector
  &_row
    cursor pointer
  &_nutrition
    min-width 80px
  &_serving
    font-size 14px
    min-width 80px

  @media screen and (max-width: 599px)
    &_name
      width 160px
</style>

<i18n>
en:
  name: Name
  serving: Serving
  noDataFallback: No food found
  nutrients:
    calories: Calories
    carbs: Carbs
    fat: Fat
    protein: Protein
  units:
    g: g
    kcal: kcal
    ml: ml
</i18n>
