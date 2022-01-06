<template lang="pug">
  v-speed-dial.base-fab.hidden-sm-and-up(v-model='isOpen', direction='top', transition='slide-y-reverse-transition', fixed, bottom, right)
    v-btn(color='secondary', slot='activator', v-model='isOpen', dark, fab)
      v-icon more_vert
      v-icon close
    slot(name='content')
</template>

<script>
export default {
  name: 'BaseFab',
  data () {
    return {
      isOpen: false,
    };
  },
};
</script>
