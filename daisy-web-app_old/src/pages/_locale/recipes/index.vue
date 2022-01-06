<template lang="pug">
  v-layout.pages-recipes-index(row, wrap)
    v-flex(xs12)
      base-control-title(:title="$t('page.title')")
        template(v-slot:controls)
          v-btn(color='green lighten-1', fab, dark, small, @click='createNewRecipe()')
            v-icon add

    v-flex(xs12)
      v-form(@submit.prevent='onSearchFormSubmit()')
        v-text-field(v-model='searchString', :disabled='isLoading', :placeholder="$t('searchPlaceholder')",
          ref='searchInput', prepend-inner-icon='search', solo, clearable, autofocus, hide-details, @input='onSearchInput()')

    v-flex(xs12)
      recipes-table(:recipes='computedRecipes')

    base-fab
      template(v-slot:content)
        v-btn(color='green lighten-1', fab, dark, small, @click='createNewRecipe()')
          v-icon add
</template>

<script>
import { mapState } from 'vuex';

import Recipe from '../../../models/recipe';

import BaseControlTitle from '../../../components/base/base-control-title';
import BaseFab from '../../../components/base/base-fab';
import RecipesTable from '../../../components/recipes/recipes-table';

export default {
  name: 'PagesRecipesIndex',
  components: {
    BaseControlTitle,
    BaseFab,
    RecipesTable,
  },
  head () {
    return {
      title: this.$t('page.title'),
      meta: [ { name: 'description', content: this.$t('page.description') } ],
    };
  },
  computed: {
    ...mapState([ 'isLoading' ]),

    searchString: {
      get () { return this.$route.query['search']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'search': newValue }); },
    },
    computedRecipes () {
      return this.recipes.map(recipe => new Recipe({
        ...recipe,
        summary: Recipe.getNutrientSummary(recipe),
      }));
    },
  },
  methods: {
    createNewRecipe () {
      this.$router.push({ name: 'locale-recipes-new' });
    },
    onSearchInput () {
      if (this._searchInputTimeoutId) {
        window.clearTimeout(this._searchInputTimeoutId);
      }
      this._searchInputTimeoutId = window.setTimeout(() => this.onSearchFormSubmit(), 300);
    },
    async onSearchFormSubmit () {
      await this.fetchRecipes();
      this.$nextTick(() => this.$refs.searchInput.focus());
    },
    async fetchRecipes () {
      this.$store.commit('startLoading');
      try {
        const response = await this.$axios.$get('/api/recipes', { params: { search: this.searchString } });
        this.recipes = response.map(item => new Recipe(item));
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
  },

  async asyncData ({ route, error, $axios }) {
    try {
      const response = await $axios.$get('/api/recipes', { params: { search: route.query['search'] } });
      return { recipes: response.map(item => new Recipe(item)) };
    } catch (ex) {
      error({ statusCode: ex.response.status });
    }
  },
};
</script>

<i18n>
en:
  searchPlaceholder: Search recipes
  page:
    title: Recipes
    description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  notifications:
    unknownErrorOccurred: Something went wrong
</i18n>
