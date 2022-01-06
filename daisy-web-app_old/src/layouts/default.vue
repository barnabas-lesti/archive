<template lang="pug">
  v-app.layout-default
    layout-toolbar(:menu-items='menuItems', :user='user', @open-sidebar='isSidebarOpen = true;')
    layout-sidebar(v-model='isSidebarOpen', :menu-items='menuItems', :user='user')
    v-content
      v-container.layout-default_container(grid-list-xl)
        nuxt
    layout-footer(:social-items='socialItems')
    layout-notifications(v-model='notification')
</template>

<script>
import { mapState } from 'vuex';

import LayoutToolbar from '../components/layout/layout-toolbar';
import LayoutSidebar from '../components/layout/layout-sidebar';
import LayoutFooter from '../components/layout/layout-footer';
import LayoutNotifications from '../components/layout/layout-notifications';

export default {
  components: {
    LayoutToolbar,
    LayoutSidebar,
    LayoutFooter,
    LayoutNotifications,
  },
  data () {
    return {
      isSidebarOpen: false,
    };
  },
  computed: {
    ...mapState('user', [ 'user' ]),
    ...mapState('navigation', [ 'socialItems' ]),

    menuItems () {
      const { menuItems } = this.$store.state.navigation;
      return menuItems.map(item => ({
        ...item,
        label: this.$t(item.labelKey),
      }));
    },
    notification: {
      get () { return this.$store.state.notifications.notification; },
      set (newValue) { this.$store.commit('notifications/clear'); },
    },
  },
  methods: {
    signOut () {
      this.isSidebarOpen = false;
      this.$auth.signOut();
    },
  },
};
</script>

<style lang="stylus">
.layout-default
  &_container
    @media only screen and (min-width: 1264px)
      max-width 1185px

</style>

<i18n>
en:
  menuItems:
    home: Home
    calculator: Calculator
    food: Food
    recipes: Recipes
    exercises: Exercises
</i18n>
