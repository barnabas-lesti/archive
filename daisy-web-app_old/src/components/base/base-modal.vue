<template lang="pug">
  v-dialog.base-modal(:value='value', transition='dialog-bottom-transition', :fullscreen='$vuetify.breakpoint.xs',
    :max-width='$vuetify.breakpoint.xs ? "none" : maxWidth', lazy, @input='emitInput($event)')
    v-card
      v-toolbar.blue.lighten-1(card, dark)
        v-toolbar-title(v-if='title') {{ title }}
        v-spacer
        v-toolbar-items
          v-btn(:loading='loading', icon, @click="emitAccept()")
            v-icon done
          v-btn(icon, @click="emitDiscard()")
            v-icon close
      v-card-text
        slot
</template>

<script>
export default {
  name: 'BaseLoader',
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => '',
    },
    maxWidth: {
      type: [ String, Number ],
      default: () => '80%',
    },
    loading: Boolean,
    closeOnAccept: Boolean,
    closeOnDiscard: Boolean,
  },
  methods: {
    emitInput (value) {
      if (value) return this.emitAccept();
      return this.emitDiscard();
    },
    emitAccept () {
      this.$emit('accept');
      if (this.closeOnAccept) this.$emit('input', false);
    },
    emitDiscard () {
      this.$emit('discard');
      if (this.closeOnDiscard) this.$emit('input', false);
    },
  },
};
</script>
