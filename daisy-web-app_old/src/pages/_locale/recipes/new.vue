<template lang="pug">
  recipes-editor.pages-recipes-new(:title="$t('page.title')")
</template>

<script>
import RecipesEditor from '../../../components/recipes/recipes-editor';

export default {
  name: 'PagesRecipesNew',
  components: {
    RecipesEditor,
  },
  head () {
    return {
      title: this.$t('page.title'),
      meta: [ { name: 'description', content: this.$t('page.description') } ],
    };
  },
};
</script>

<i18n>
en:
  page:
    title: New recipe
    description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</i18n>
