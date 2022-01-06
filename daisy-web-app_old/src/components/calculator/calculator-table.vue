<template lang="pug">
  .calculator-table
    v-data-table.elevation-1(v-if='items && items.length', :value='value', :items='items', :headers='headers',
      item-key='_id', hide-actions, @input='onInput')
      template(v-slot:items='props')
        tr.calculator-table_row(:class="props.selected ? 'blue lighten-4': ''", :active='props.selected', @click='props.selected = !props.selected')
          td
            v-icon(v-if="props.item.type === 'food'", small) fastfood
            v-icon(v-if="props.item.type === 'recipe'", small) book
            v-icon(v-if="props.item.type === 'exercise'", small) directions_run
          td.pl-1
            div.calculator-table_name.font-weight-bold.text-truncate {{ props.item.content.name }}
          td.text-xs-right
            v-text-field.calculator-table_serving.my-2.py-0(v-model='props.item.serving.value', :suffix="$tc(`units.${props.item.serving.unit}`, props.item.serving.value)",
              type='number', hide-details, @click.stop)
          td.text-xs-right
            .calculator-table_nutrient(v-if='props.item.nutrients.calories.servingMultiplier')
              | {{ props.item.nutrients.calories.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.kcal') }}
          td.text-xs-right
            .calculator-table_nutrient(v-if='props.item.nutrients.carbs.servingMultiplier')
              | {{ props.item.nutrients.carbs.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .calculator-table_nutrient(v-if='props.item.nutrients.protein.servingMultiplier')
              | {{ props.item.nutrients.protein.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .calculator-table_nutrient(v-if='props.item.nutrients.fat.servingMultiplier')
              | {{ props.item.nutrients.fat.servingMultiplier * props.item.serving.value | twoDecimal }} {{ $t('units.g') }}
    v-card.pa-4.text-xs-center(v-else)
      slot(name='noData') {{ $t('noDataFallback') }}
</template>

<script>
export default {
  name: 'CalculatorTable',
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
        { text: '', value: 'type', align: 'left' },
        { text: this.$t('name'), value: 'content.name', align: 'left', class: 'pl-1' },
        { text: this.$t('serving'), value: 'serving.value', align: 'right' },
        { text: this.$t('nutrients.calories'), value: 'nutrients.calories.value', align: 'right' },
        { text: this.$t('nutrients.carbs'), value: 'nutrients.carbs.value', align: 'right' },
        { text: this.$t('nutrients.protein'), value: 'nutrients.protein.value', align: 'right' },
        { text: this.$t('nutrients.fat'), value: 'nutrients.fat.value', align: 'right' },
      ],
    };
  },
  methods: {
    onInput (selection) {
      this.$emit('input', selection);
    },
  },
};
</script>

<style lang="stylus">
.calculator-table
  &_row
    cursor pointer

  &_serving
    font-size 14px
    min-width 70px
  &_nutrient
    min-width 80px

  @media screen and (max-width: 599px)
    &_name
      width 150px
</style>

<i18n>
en:
  name: Name
  serving: Serving
  noDataFallback: No items found
  nutrients:
    calories: Calories
    carbs: Carbs
    fat: Fat
    protein: Protein
  units:
    kj: kJ
    g: g
    ml: ml
    kcal: kcal
    mins: min | mins
    plates: plate | plates
</i18n>
