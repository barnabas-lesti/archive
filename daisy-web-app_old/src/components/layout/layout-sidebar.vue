<template lang="pug">
  v-navigation-drawer.layout-sidebar.hidden-md-and-up(:value='value',
    :hide-overlay='this.$vuetify.breakpoint.mdAndUp', app, temporary, @input='$emit("input", $event)')
    v-toolbar.transparent(flat)
      v-toolbar-title {{ $t('brand') }}
    v-divider

    v-list.pt-0
      v-list-tile(v-if='user', avatar)
        v-list-tile-avatar
          img.elevation-3(:src='profileImageSrc')
        v-list-tile-content
          v-list-tile-title {{ user.nickname }}
          v-list-tile-sub-title {{ user.email }}
      v-list-tile(v-else, :to="{ name: 'locale-sign-in', query: { 'ref': $route.name } }", nuxt)
        v-list-tile-action
          v-icon exit_to_app
        v-list-tile-content {{ $t('signIn') }}
      v-divider

      v-list-tile(v-for='item of menuItems', :key='item.labelKey', :to='{ name: item.routeName }', :exact='item.exact', nuxt)
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.label || $t(item.labelKey) }}

      template(v-if='user')
        v-divider
        v-list-tile(:to="{ name: 'locale-profile' }", nuxt)
          v-list-tile-action
            v-icon account_circle
          v-list-tile-content {{ $t('profile') }}
        v-list-tile(:to="{ name: 'locale-sign-out', query: { 'ref': $route.name } }", nuxt)
          v-list-tile-action
            v-icon.layout-sidebar_sign-out-icon exit_to_app
          v-list-tile-content {{ $t('signOut') }}
</template>

<script>
export default {
  name: 'LayoutSidebar',
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
    menuItems: {
      type: Array,
      required: true,
    },
    user: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null,
    },
  },
  computed: {
    profileImageSrc () { return (this.user && this.user.profileImageUrl) || '/images/no-profile-image.png'; },
  },
};
</script>

<style lang="stylus">
.layout-sidebar
  &_sign-out-icon
    transform rotate(180deg)

</style>

<i18n>
en:
  brand: Daisy
  register: Register
  signIn: Sign in or Register
  signOut: Sign out
  profile: Profile
</i18n>
