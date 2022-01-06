<template lang="pug">
  v-footer.layout-footer.mt-5.light-blue.darken-4(height='auto', dark)
    v-container
      v-layout(justify-center, row, wrap)
        v-flex.my-4.text-xs-center(xs12)
          v-btn.mx-2(v-for='item in socialItems', :key='item.url', :href='item.url' target='_blank', icon)
            v-avatar.elevation-2(size='36')
              img(:src='item.iconImagePath', :alt='item.name')
        v-flex.mb-4.text-xs-center(v-html="$t('descriptionHtml')", xs12)
        v-flex.mb-4.text-xs-center(v-html="$t('copyrightHtml')", xs12)
</template>

<script>
export default {
  name: 'LayoutFooter',
  props: {
    socialItems: {
      type: Array,
      required: true,
    },
  },
};
</script>

<i18n>
en:
  descriptionHtml: Lorem ipsum dolor sit amet. <strong>Quisque porttitor nibh</strong> id massa semper, non dictum ex cursus. Cras venenatis euismod dapibus.
  copyrightHtml: "&copy;2019 — <strong>RainbowSoft</strong>"
</i18n>
