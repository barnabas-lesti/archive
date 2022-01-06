<template lang="pug">
  .pages-index
    v-layout(row, wrap)
      v-flex(xs12)
        h1.pb-3 {{ $t('title') }}

      v-flex(xs12)
        .pb-3(v-html="$t('descriptionHtml')")

      v-flex.mb-3(v-for="(item, index) of cards", :key='index', xs12, sm6)
        v-card(:to='{ name: item.routeName }', nuxt, hover)
          v-img(:src='item.thumbnailPath', height='190px')
          v-card-title(primary-title)
            div
              h3.headline.mb-0 {{ item.title }}
              div(v-html='item.descriptionHtml')
          v-card-actions
            v-btn(color='orange', flat) {{ item.actionLabel }}
</template>

<script>
export default {
  name: 'PagesIndex',
  head () {
    return {
      title: this.$t('title'),
      meta: [ { name: 'description', content: this.$t('description') } ],
    };
  },
  data () {
    return {
      cards: [
        {
          title: this.$t('cards.food.title'),
          descriptionHtml: this.$t('cards.food.descriptionHtml'),
          actionLabel: this.$t('cards.defaultActionLabel'),
          thumbnailPath: '/images/food-materials.jpg',
          routeName: 'locale-food',
        },
        {
          title: this.$t('cards.recipes.title'),
          descriptionHtml: this.$t('cards.recipes.descriptionHtml'),
          actionLabel: this.$t('cards.defaultActionLabel'),
          thumbnailPath: '/images/recipes.jpg',
          routeName: 'locale-recipes',
        },
        {
          title: this.$t('cards.exercises.title'),
          descriptionHtml: this.$t('cards.exercises.descriptionHtml'),
          actionLabel: this.$t('cards.defaultActionLabel'),
          thumbnailPath: '/images/exercise.jpg',
          routeName: 'locale-exercises',
        },
        {
          title: this.$t('cards.calculator.title'),
          descriptionHtml: this.$t('cards.calculator.descriptionHtml'),
          actionLabel: this.$t('cards.defaultActionLabel'),
          thumbnailPath: '/images/calorie-calculation.jpg',
          routeName: 'locale-calculator',
        },
      ],
    };
  },
};
</script>

<i18n>
en:
  title: Welcome to Daisy
  description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  descriptionHtml: "<strong>Quisque porttitor nibh</strong> id massa semper, non dictum ex cursus. Cras venenatis euismod dapibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  cards:
    defaultActionLabel: Check out
    food:
      title: Food
      descriptionHtml: Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Quisque porttitor nibh</strong> id massa semper, non dictum ex cursus. Cras venenatis euismod dapibus.
    recipes:
      title: Recipes
      descriptionHtml: Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Quisque porttitor nibh</strong> id massa semper. Cras venenatis euismod dapibus.
    exercises:
      title: Exercises
      descriptionHtml: "<strong>Quisque porttitor nibh</strong> id massa semper, non dictum ex cursus. Cras venenatis euismod dapibus."
    calculator:
      title: Calculator
      descriptionHtml: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non dictum ex cursus. Cras venenatis euismod dapibus.
</i18n>
