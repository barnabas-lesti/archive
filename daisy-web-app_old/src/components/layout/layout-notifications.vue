<template lang="pug">
  v-snackbar.layout-notifications(v-if='value', :value='value', :color='value.type', :timeout='timeout',
    :bottom='$vuetify.breakpoint.smAndUp', :right='$vuetify.breakpoint.smAndUp', auto-height,
    @input='$emit("input", $event)')
    span(v-if='value.html', v-html='value.html')
    span(v-else) {{ value.text }}
</template>

<script>
export default {
  name: 'LayoutNotifications',
  props: {
    value: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  data () { return { timeout: 3000 }; },
};
</script>
