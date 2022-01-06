<template lang="pug">
  recipes-editor.pages-recipes-id(:title='recipe.content.name', :recipe='recipe')
</template>

<script>
import RecipesEditor from '../../../components/recipes/recipes-editor';

export default {
  name: 'PagesRecipesId',
  components: {
    RecipesEditor,
  },
  head () {
    return {
      title: this.recipe.content.name || this.$t('page.fallbackTitle'),
      meta: [ { name: 'description', content: this.recipe.content.description } ],
    };
  },
  async asyncData ({ params, error, $axios }) {
    try {
      return { recipe: await $axios.$get(`/api/recipes/${params.id}`) };
    } catch (ex) {
      error({ statusCode: ex.response.status });
    }
  },
};
</script>

<i18n>
en:
  page:
    fallbackTitle: Just a recipe
</i18n>
