<template lang="pug">
  .recipes-editor
    base-modal(:value='modalMode', :title="$t('modal.addFood')", @accept='addSelectedRecipeItemsToRecipe()', @discard='closeModal()')
      template(v-slot:content)
        v-card-text
          v-layout(row, wrap)
            v-flex.mb-3(xs12)
              v-form(@submit.prevent='onSearchFormSubmit()')
                v-text-field(v-model='modal.searchString', :disabled='isLoading', :placeholder="$t('modal.searchPlaceholder')",
                  ref='searchInput', prepend-inner-icon='search', color='teal', solo, clearable, autofocus, hide-details, @input='onSearchInput')
            v-flex(xs12)
              recipes-food-selector(v-model='modal.selection', :items='modal.recipeItems')

    v-layout(row, wrap)
      v-flex(xs12)
        base-control-title(:title="title || $t('fallbackTitle')")
          template(v-slot:controls)
            v-slide-x-reverse-transition
              v-btn.teal.lighten-1(v-show='table.selection.length', dark, fab, small, @click='removeSelectedRecipeItems()')
                v-badge(color='red darken-1')
                  template(v-slot:badge)
                    v-icon remove
                  v-icon fastfood
            v-btn.teal.lighten-1(dark, fab, small, @click='openModal()')
              v-badge(color='green darken-1')
                template(v-slot:badge)
                  v-icon add
                v-icon fastfood
            v-btn.red.lighten-1(dark, fab, small, @click='deleteRecipe()')
              v-icon delete
            v-btn.green.lighten-1(dark, fab, small, @click='saveRecipe()')
              v-icon done

      v-flex.hidden-lg-and-up(xs12)
        v-text-field.mb-3(v-model='recipe.content.name', :label="$t('form.name')", hide-details)
        v-textarea.mb-3(v-model='recipe.content.description', :label="$t('form.description')", hide-details)

      v-flex.mb-3(xs12, lg3)
        v-card.light-blue.lighten-4
          v-card-title.font-weight-bold {{ $t('nutritionSummary') }}
          v-divider
          base-nutrition-summary(:model='summary')

      v-flex(xs12, lg9)
        v-layout(row, wrap)
          v-flex.hidden-md-and-down(xs12)
            v-text-field.mb-3(v-model='recipe.content.name', :label="$t('form.name')", solo, hide-details)
            v-textarea.mb-3(v-model='recipe.content.description', :label="$t('form.description')", solo, hide-details)
          v-flex(xs12)
            v-card.teal.lighten-4
              v-card-title.font-weight-bold {{ $t('table.title') }}
              v-divider
              recipes-food-selector(v-model='table.selection', :items='recipe.items')
                template(v-slot:noData)
                  span.mr-2 {{ $t('table.addFood') }}
                  v-btn.teal.lighten-1(fab, dark, small, @click='openModal()')
                    v-badge(color='green darken-1')
                      template(v-slot:badge)
                        v-icon add
                      v-icon fastfood

      base-fab
        template(v-slot:content)
          v-btn.green.lighten-1(fab, dark, small, @click='saveRecipe()')
            v-icon done
          v-btn.red.lighten-1(fab, dark, small, @click='deleteRecipe()')
            v-icon delete
          v-btn.teal.lighten-1(fab, dark, small, @click='openModal()')
            v-badge(color='green darken-1')
              template(v-slot:badge)
                v-icon add
              v-icon fastfood
          v-btn.teal.lighten-1(v-if='table.selection.length', fab, dark, small, @click='removeSelectedRecipeItems()')
            v-badge(color='red darken-1')
              template(v-slot:badge)
                v-icon remove
              v-icon fastfood
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

import Recipe from '../../models/recipe';
import RecipeItem from '../../models/recipe-item';

import BaseControlTitle from '../base/base-control-title';
import BaseFab from '../base/base-fab';
import BaseModal from '../base/base-modal';
import BaseNutritionSummary from '../base/base-nutrition-summary';
import RecipesFoodSelector from '../recipes/recipes-food-selector';

export default {
  name: 'RecipesEditor',
  components: {
    BaseControlTitle,
    BaseFab,
    BaseModal,
    BaseNutritionSummary,
    RecipesFoodSelector,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    recipe: {
      type: Object,
      default: () => new Recipe(),
    },
  },
  data () {
    return {
      isMainFabOpen: false,
      modal: {
        searchString: '',
        recipeItems: [],
        selection: [],
      },
      table: {
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
      return Recipe.getNutrientSummary(this.recipe);
    },
  },
  methods: {
    removeSelectedRecipeItems () {
      this.recipe.items = this.recipe.items.filter(item => this.table.selection.map(item => item.food._id).indexOf(item.food._id) === -1);
      this.table.selection = [];
    },
    addSelectedRecipeItemsToRecipe () {
      this.recipe.items.push(
        ...this.modal.selection
          .map(item => _.cloneDeep(item))
          .filter(item => this.recipe.items.map(item => item.food._id).indexOf(item.food._id) === -1)
      );
      this.closeModal();
      this.modal.selection = [];
    },
    openModal () { this.modalMode = 'add-food'; },
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
      await this.fetchRecipeItems();
      this.$nextTick(() => this.$refs.searchInput.focus());
    },
    async fetchRecipeItems () {
      this.$store.commit('startLoading');
      try {
        const food = await this.$axios.$get('/api/food', { params: { search: this.modal.searchString } });
        this.modal.recipeItems = food.map(item => new RecipeItem(item));
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
    async deleteRecipe () {
      if (this.recipe._id) {
        this.$store.commit('startLoading');
        try {
          await this.$axios.$delete(`/api/recipes/${this.recipe._id}`);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.deleted'));
          this.$router.push({ name: 'locale-recipes' });
        } catch (ex) {
          this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
        }
        this.$store.commit('finishLoading');
      } else {
        this.$router.go(-1);
      }
    },
    async saveRecipe () {
      this.$store.commit('startLoading');
      try {
        if (this.recipe._id) {
          await this.$axios.$patch(`/api/recipes/${this.recipe._id}`, this.recipe);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.updated'));
        } else {
          const { _id: id } = await this.$axios.$put('/api/recipes', this.recipe);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.created'));
          this.$router.push({ name: 'locale-recipes-id', params: { id } });
        }
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
  },
  mounted () {
    if (!this.modal.recipeItems.length > 0) {
      this.fetchRecipeItems();
    }
  },
};
</script>

<i18n>
en:
  fallbackTitle: Just a recipe
  modal:
    addFood: Add food
    searchPlaceholder: Search food
  form:
    name: Name
    description: Description
  nutritionSummary: Nutrition summary
  table:
    addFood: Click on the button to add food
    title: Food
  notifications:
    created: Recipe successfully created
    updated: Recipe successfully updated
    deleted: Recipe successfully deleted
    unknownErrorOccurred: Something went wrong
</i18n>
