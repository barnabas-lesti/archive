<template lang="pug">
  .exercises-table
    v-data-table.elevation-1(v-show='exercises.length', v-model='selected', :headers='headers',
      :items='exercises' ref='dataTable', item-key='_id', hide-actions)
      template(v-slot:items='props')
        tr.exercises-table_row(:active='props.selected', @click='onListItemClick(props.item)')
          td
            div.exercises-table_name.font-weight-bold.text-truncate {{ props.item.content.name }}
            div.font-italic {{ `${props.item.duration.value} ${$tc('units.mins', props.item.duration.value)}` }}
          td.text-xs-right {{ props.item.calorieBurn.value }} {{ $t('units.kcal') }}
      template(v-slot:expand='props')
        v-card.grey.lighten-4(flat, tile)
          v-card-title.px-4.pb-2.caption.font-weight-bold {{ $t('description') }}
          v-card-text.px-4.pt-0.caption
            span(v-if="props.item.content.description") {{ props.item.content.description }}
            span.font-italic(v-if="!props.item.content.description") {{ $t('noDescription') }}
        v-divider
    v-card.pa-4.text-xs-center(v-show='!exercises.length') {{ $t('noData') }}
</template>

<script>
export default {
  name: 'ExercisesTable',
  props: {
    exercises: {
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
        { text: this.$t('calorieBurn'), value: 'calorieBurn.value', align: 'right' },
      ],
    };
  },
  computed: {
    selected () {
      return [...this.exercises.filter(item => item._id === this.value._id)];
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
.exercises-table
  &_row
    cursor pointer

  @media screen and (max-width: 599px)
    &_name
      width 130px
</style>

<i18n>
en:
  name: Name
  calorieBurn: Calorie Burn
  duration: Duration
  description: Description
  noDescription: No description available
  noData: No exercises found
  units:
    kcal: kcal
    mins: min | mins
</i18n>
