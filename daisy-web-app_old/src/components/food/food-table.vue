<template lang="pug">
  .food-table
    v-data-table.elevation-1(v-show='food.length', v-model='selected', :headers='headers',
      :items='food' ref='dataTable', item-key='_id', hide-actions)
      template(v-slot:items='props')
        tr.food-table_row(:active='props.selected', @click='onListItemClick(props.item)')
          td
            div.food-table_name.font-weight-bold.text-truncate {{ props.item.content.name }}
            div.font-italic {{ `${props.item.serving.value} ${$t(`units.${props.item.serving.unit}`)}` }}
          td.text-xs-right {{ props.item.nutrients.calories.value }} {{ $t('units.kcal') }}
          td.text-xs-right {{ props.item.nutrients.carbs.value }} {{ $t('units.g') }}
          td.text-xs-right {{ props.item.nutrients.protein.value }} {{ $t('units.g') }}
          td.text-xs-right {{ props.item.nutrients.fat.value }} {{ $t('units.g') }}
      template(v-slot:expand='props')
        v-card.grey.lighten-4(flat, tile)
          v-card-title.px-4.pb-2.caption.font-weight-bold {{ $t('description') }}
          v-card-text.px-4.pt-0.caption
            span(v-if="props.item.content.description") {{ props.item.content.description }}
            span.font-italic(v-if="!props.item.content.description") {{ $t('noDescription') }}
        v-divider
    v-card.pa-4.text-xs-center(v-show='!food.length') {{ $t('noData') }}
</template>

<script>
export default {
  name: 'FoodTable',
  props: {
    food: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      headers: [
        { text: this.$t('name'), value: 'content.name', align: 'left' },
        { text: this.$t('nutrients.calories'), value: 'nutrients.calories.value', align: 'right' },
        { text: this.$t('nutrients.carbs'), value: 'nutrients.carbs.value', align: 'right' },
        { text: this.$t('nutrients.protein'), value: 'nutrients.protein.value', align: 'right' },
        { text: this.$t('nutrients.fat'), value: 'nutrients.fat.value', align: 'right' },
      ],
    };
  },
  computed: {
    selected () {
      return [...this.food.filter(item => item._id === this.value._id)];
    },
  },
  methods: {
    onListItemClick (item) {
      const deselect = !!this.selected.filter(selectedItem => selectedItem._id === item._id).length;
      this.$emit('input', deselect ? undefined : item);
    },
    updateExpanded () {
      this.$refs.dataTable.expanded = this.value._id ? { [this.value._id]: true } : {};
    },
  },
  watch: {
    value () { this.updateExpanded(); },
  },
  mounted () { this.updateExpanded(); },
};
</script>

<style lang="stylus">
.food-table
  &_row
    cursor pointer

  @media screen and (max-width: 599px)
    &_name
      width 160px
</style>

<i18n>
en:
  name: Name
  description: Description
  noDescription: No description available
  noData: No food found
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
