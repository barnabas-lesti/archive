<template lang="pug">
  .pages-food-index
    base-modal(:value='modalMode', :title="$t(`modal.${ modal.model._id ? 'editTitle' : 'createTitle' }`)",
      @accept='saveFood()', @discard='closeModal()')
      template(v-slot:content)
        v-form(@submit.prevent='saveFood()')
          v-card-text
            v-text-field(v-model='modal.model.content.name', :label="$t('name')")
            v-layout(wrap, row)
              v-flex(xs8)
                v-text-field(v-model='modal.model.serving.value', :label="$t('serving')", type='number')
              v-spacer
              v-flex(xs3)
                v-select(v-model='modal.model.serving.unit', :label="$t('unit')", :items="[ 'g', 'ml' ]")
                  template(v-slot:selection='data')
                    | {{ $t(`units.${data.item}`) }}
                  template(v-slot:item='data')
                    | {{ $t(`units.${data.item}`) }}
            v-text-field(v-model='modal.model.nutrients.calories.value', :label="$t('nutrients.calories')", :suffix="$t('units.kcal')", type='number')
            v-text-field(v-model='modal.model.nutrients.carbs.value', :label="$t('nutrients.carbs')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.protein.value', :label="$t('nutrients.protein')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.fat.value', :label="$t('nutrients.fat')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.energy.value', :label="$t('nutrients.energy')", :suffix="$t('units.kj')", type='number')
            v-text-field(v-model='modal.model.nutrients.fiber.value', :label="$t('nutrients.fiber')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.salt.value', :label="$t('nutrients.salt')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.saturatedFat.value', :label="$t('nutrients.saturatedFat')", :suffix="$t('units.g')", type='number')
            v-text-field(v-model='modal.model.nutrients.sugar.value', :label="$t('nutrients.sugar')", :suffix="$t('units.g')", type='number')
            v-textarea(v-model='modal.model.content.description', :label="$t('description')")

    v-layout(row, wrap)
      v-flex(xs12)
        base-control-title(:title="$t('page.title')")
          template(v-slot:controls)
            v-slide-x-reverse-transition
              v-btn.red.lighten-1(v-show='selection', :loading='isLoading', fab, dark, small, @click='deleteFood()')
                v-icon delete
            v-slide-x-reverse-transition
              v-btn.blue.lighten-1(v-show='selection', fab, dark, small, @click='openEditModal()')
                v-icon create
            v-btn.green.lighten-1(fab, dark, small, @click='openCreateModal()')
              v-icon add

      v-flex(xs12)
        v-form(@submit.prevent='onSearchFormSubmit()')
          v-text-field(v-model='searchString', :disabled='isLoading', :placeholder="$t('searchPlaceholder')",
            ref='searchInput', prepend-inner-icon='search', solo, clearable, autofocus, hide-details, @input='onSearchInput()')

      v-flex(xs12)
        food-table(v-model='selectedFood', :food='food')

      base-fab
        template(v-slot:content)
          v-btn.green.lighten-1(fab, dark, small, @click='openCreateModal()')
            v-icon add
          v-btn.blue.lighten-1(v-if='selection', fab, dark, small, @click='openEditModal()')
            v-icon create
          v-btn.red.lighten-1(v-if='selection', :loading='isLoading', fab, dark, small, @click='deleteFood()')
            v-icon delete
</template>

<script>
import { mapState } from 'vuex';

import Food from '../../models/food';

import BaseControlTitle from '../../components/base/base-control-title';
import BaseFab from '../../components/base/base-fab';
import BaseModal from '../../components/base/base-modal';
import FoodTable from '../../components/food/food-table';

export default {
  name: 'PagesFoodIndex',
  components: {
    BaseControlTitle,
    BaseFab,
    BaseModal,
    FoodTable,
  },
  head () {
    return {
      title: this.$t('page.title'),
      meta: [ { name: 'description', content: this.$t('page.description') } ],
    };
  },
  data () {
    return {
      modal: {
        model: new Food(),
      },
    };
  },
  computed: {
    ...mapState([ 'isLoading' ]),

    selection: {
      get () { return this.$route.query['selection']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'selection': newValue }); },
    },
    modalMode: {
      get () { return this.$route.query['modal']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'modal': newValue }); },
    },
    searchString: {
      get () { return this.$route.query['search']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'search': newValue }); },
    },
    selectedFood: {
      get () { return this.food.filter(item => item._id === this.selection)[0]; },
      set (newValue) { this.selection = newValue ? newValue._id : undefined; },
    },
  },

  methods: {
    openCreateModal () {
      this.modal.model = new Food();
      this.modalMode = 'create';
    },
    openEditModal () {
      this.modal.model = new Food(this.food.filter(item => item._id === this.selection)[0]);
      this.modalMode = 'edit';
    },
    closeModal () {
      this.modalMode = undefined;
    },
    onFoodListSelect (id) {
      this.selection = id !== this.$route.query.selection ? id : undefined;
    },
    onSearchInput (search) {
      if (this._searchInputTimeoutId) {
        window.clearTimeout(this._searchInputTimeoutId);
      }
      this._searchInputTimeoutId = window.setTimeout(() => this.onSearchFormSubmit(), 300);
    },
    async onSearchFormSubmit () {
      await this.fetchFood();
      this.$nextTick(() => this.$refs.searchInput.focus());
    },
    async fetchFood () {
      this.$store.commit('startLoading');
      try {
        const response = await this.$axios.$get('/api/food', { params: { search: this.searchString } });
        this.food = response.map(item => new Food(item));
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
    async deleteFood () {
      this.$store.commit('startLoading');
      try {
        await this.$axios.$delete(`/api/food/${this.selection}`);
        this.$store.commit('notifications/showSuccess', this.$t('notifications.deleted'));
        this.selection = undefined;
        await this.fetchFood();
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
    async saveFood () {
      this.$store.commit('startLoading');
      try {
        if (this.modal.model._id) {
          await this.$axios.$patch(`/api/food/${this.modal.model._id}`, this.modal.model);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.updated'));
        } else {
          await this.$axios.$put('/api/food', this.modal.model);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.created'));
        }
        this.modal.model = new Food();
        this.closeModal();
        await this.fetchFood();
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
  },

  async asyncData ({ route, error, $axios }) {
    try {
      const response = await $axios.$get('/api/food', { params: { search: route.query['search'] } });
      return { food: response.map(item => new Food(item)) };
    } catch (ex) {
      error({ statusCode: ex.response.status });
    }
  },
  mounted () {
    if (this.modalMode === 'edit') {
      this.openEditModal();
    }
  },
};
</script>

<i18n>
en:
  searchPlaceholder: Search food
  name: Name
  serving: Serving
  unit: Unit
  description: Description
  page:
    title: Food
    description: Lorem ipsum dolor sit amet.
  modal:
    createTitle: Create food
    editTitle: Edit food
  notifications:
    created: Food successfully created
    updated: Food successfully updated
    deleted: Food successfully deleted
  nutrients:
    calories: Calories
    carbs: Carbs
    energy: Energy
    fat: Fat
    fiber: Fiber
    protein: Protein
    salt: Salt
    saturatedFat: Saturated Fat
    sugar: Sugar
  units:
    g: g
    kcal: kcal
    ml: ml
    kj: kJ
</i18n>
