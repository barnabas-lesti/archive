<template lang="pug">
  .pages-calculator-index
    base-modal(:value='modalMode', :title="$t('modal.addItems')",
      @accept='addSelectedItemsToCalculator()', @discard='closeModal()')
      template(v-slot:content)
        v-card-text
          v-layout(row, wrap)
            v-flex.mb-3(xs12)
              v-form(@submit.prevent='onSearchFormSubmit()')
                v-text-field(v-model='modal.searchString', :disabled='isLoading', :placeholder="$t('modal.searchPlaceholder')",
                  ref='searchInput', prepend-inner-icon='search', color='teal', solo, clearable, autofocus, hide-details, @input='onSearchInput')
            v-flex(xs12)
              calculator-table(v-model='modal.selection', :items='modal.items')

    v-layout(row, wrap)
      v-flex(xs12)
        base-control-title(:title="$t('page.title')")
          template(v-slot:controls)
            v-slide-x-reverse-transition
              v-btn.blue.lighten-2(v-show='selection.length', fab, dark, small, @click='removeSelectedItems()')
                v-badge(color='red darken-1')
                  template(v-slot:badge)
                    v-icon remove
                  v-icon layers
            v-btn.blue.lighten-2(fab, dark, small, @click='openModal()')
              v-badge(color='green darken-1')
                template(v-slot:badge)
                  v-icon add
                v-icon layers

      v-flex(xs12, lg3)
        v-card.light-blue.lighten-4
          v-card-title.font-weight-bold {{ $t('nutritionSummary') }}
          v-divider
          base-nutrition-summary(:model='summary')

      v-flex(sm12, lg9)
        calculator-table(v-model='selection', :items='items')
          template(v-slot:noData)
            span.mr-2 {{ $t('noItems') }}
            v-btn.blue.lighten-2(fab, dark, small, @click='openModal()')
              v-badge(color='green darken-1')
                template(v-slot:badge)
                  v-icon add
                v-icon layers

      base-fab
        template(v-slot:content)
          v-btn.blue.lighten-2(fab, dark, small, @click='openModal()')
            v-badge(color='green darken-1')
              template(v-slot:badge)
                v-icon add
              v-icon layers
          v-btn.blue.lighten-2(v-if='selection.length', fab, dark, small, @click='removeSelectedItems()')
            v-badge(color='red darken-1')
              template(v-slot:badge)
                v-icon remove
              v-icon layers
</template>

<script>
import { mapState } from 'vuex';

import CalculatorItem from '../../models/calculator-item';

import BaseControlTitle from '../../components/base/base-control-title';
import BaseFab from '../../components/base/base-fab';
import BaseModal from '../../components/base/base-modal';
import BaseNutritionSummary from '../../components/base/base-nutrition-summary';
import CalculatorTable from '../../components/calculator/calculator-table';

export default {
  name: 'PagesCalculatorIndex',
  components: {
    BaseControlTitle,
    BaseFab,
    BaseModal,
    BaseNutritionSummary,
    CalculatorTable,
  },
  head () {
    return {
      title: this.$t('page.title'),
      meta: [ { name: 'description', content: this.$t('page.description') } ],
    };
  },
  data () {
    return {
      items: [],
      selection: [],
      modal: {
        searchString: '',
        items: [],
        selection: [],
      },
    };
  },
  computed: {
    ...mapState([ 'isLoading' ]),

    modalMode: {
      get () { return this.$route.query['modal']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'modal': newValue }); },
    },
    summary () {
      return CalculatorItem.getNutrientSummary(this.items);
    },
  },
  methods: {
    addSelectedItemsToCalculator () {
      this.items.push(...this.modal.selection.filter(item => this.items.map(item => item._id).indexOf(item._id) === -1));
      this.closeModal();
      this.modal.selection = [];
    },
    removeSelectedItems () {
      this.items = this.items.filter(item => this.selection.map(item => item._id).indexOf(item._id) === -1);
      this.selection = [];
    },
    async openModal () {
      if (!this.modal.items.length > 0) {
        await this.fetchItems();
      }
      this.modalMode = 'add-item';
    },
    closeModal () { this.modalMode = undefined; },
    onSearchInput () {
      if (this._searchInputTimeoutId) {
        window.clearTimeout(this._searchInputTimeoutId);
      }
      this._searchInputTimeoutId = window.setTimeout(() => {
        this.onSearchFormSubmit();
      }, 300);
    },
    async onSearchFormSubmit () {
      await this.fetchItems();
      this.$nextTick(() => this.$refs.searchInput.focus());
    },
    async fetchItems () {
      this.$store.commit('startLoading');
      const requestOptions = { params: { search: this.modal.searchString } };
      try {
        const [ exercises, food, recipes ] = await Promise.all([
          this.$axios.$get('/api/exercises', requestOptions),
          this.$axios.$get('/api/food', requestOptions),
          this.$axios.$get('/api/recipes', requestOptions),
        ]);
        this.modal.items = [
          ...exercises.map(item => CalculatorItem.createFromExercise(item)),
          ...food.map(item => CalculatorItem.createFromFood(item)),
          ...recipes.map(item => CalculatorItem.createFromRecipe(item)),
        ];
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
  },
  mounted () {
    if (this.modalMode && !this.modal.items.length > 0) { this.fetchItems(); }
  },
};
</script>

<i18n>
en:
  nutritionSummary: Summary
  noItems: Click on the button to add items
  page:
    title: Calculator
    description: Tool to help calculate your calorie intake
  modal:
    addItems: Add items
    searchPlaceholder: Search recipes, food...
    table:
      noData: No items found
  notifications:
    unknownErrorOccurred: Something went wrong
</i18n>
