<template lang="pug">
  v-progress-linear.base-loader(v-if='isLoading', height='3px', indeterminate)
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'BaseLoader',
  computed: {
    ...mapState([ 'isLoading' ]),
  },
  methods: {
    start () { this.$store.commit('startLoading'); },
    finish () { this.$store.commit('finishLoading'); },
  },
};
</script>

<style>
.base-loader {
	position: fixed !important;
	margin: 0 !important;
	top: 0;
	left: 0;
	z-index: 2000;
}
</style>
