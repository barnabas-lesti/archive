<template lang="pug">
  .recipes-table
    v-data-table.elevation-1(v-if='recipes.length', :headers='headers', :items='recipes', item-key='_id', hide-actions)
      template(v-slot:items='props')
        tr.recipes-table_row(@click='onListItemClick(props.item._id)')
          td
            .recipes-table_name.font-weight-bold.text-truncate {{ props.item.content.name }}
          td.text-xs-right
            .recipes-table_nutrient {{ props.item.summary.calories.value | twoDecimal }} {{ $t('units.kcal') }}
          td.text-xs-right
            .recipes-table_nutrient {{ props.item.summary.carbs.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .recipes-table_nutrient {{ props.item.summary.protein.value | twoDecimal }} {{ $t('units.g') }}
          td.text-xs-right
            .recipes-table_nutrient {{ props.item.summary.fat.value | twoDecimal }} {{ $t('units.g') }}
    v-card.pa-4.text-xs-center(v-else) {{ $t('noData') }}
</template>

<script>
export default {
  name: 'RecipesTable',
  props: {
    recipes: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      headers: [
        { text: this.$t('name'), value: 'content.name', align: 'left' },
        { text: this.$t('nutrients.calories'), value: 'summary.calories.value', align: 'right' },
        { text: this.$t('nutrients.carbs'), value: 'summary.carbs.value', align: 'right' },
        { text: this.$t('nutrients.protein'), value: 'summary.protein.value', align: 'right' },
        { text: this.$t('nutrients.fat'), value: 'summary.fat.value', align: 'right' },
      ],
    };
  },
  methods: {
    onListItemClick (id) { this.$router.push({ name: 'locale-recipes-id', params: { id } }); },
  },
};
</script>

<style lang="stylus">
.recipes-table
  &_row
    cursor pointer
  &_nutrient
    min-width 80px

  @media screen and (max-width: 599px)
    &_name
      width 160px

</style>

<i18n>
en:
  name: Name
  noData: No recipes found
  nutrients:
    calories: Calories
    carbs: Carbs
    fat: Fat
    protein: Protein
  units:
    g: g
    kcal: kcal
</i18n>
