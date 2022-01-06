<template lang="pug">
  v-layout.base-control-title(row)
    v-flex(grow)
      h1 {{ title }}
    v-flex.hidden-xs-only(shrink)
      slot(name='controls')
</template>

<script>
export default {
  name: 'BaseControlTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
