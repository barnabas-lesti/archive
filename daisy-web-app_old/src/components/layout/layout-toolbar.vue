<template lang="pug">
  v-toolbar.layout-toolbar(app, dense)
    v-toolbar-side-icon.hidden-md-and-up(@click='$emit("open-sidebar")')
    v-toolbar-title {{ $t('brand') }}
    v-spacer
    v-toolbar-items
      v-btn.hidden-sm-and-down(v-for='item of menuItems', :key='item.labelKey', :to='{ name: item.routeName }',
        :exact='item.exact', flat, nuxt) {{ item.label || $t(item.labelKey) }}
      v-menu(min-width='192', offset-y)
        template(v-slot:activator='{ on }')
          v-btn(v-on='on', icon)
            v-avatar(v-if='user', size='36')
              v-img.elevation-3(:src='profileImageSrc')
            v-icon.grey--text(v-else, size='36') account_circle
        v-list(v-if='user')
          v-list-tile(avatar)
            v-list-tile-avatar
              img.elevation-3(:src='profileImageSrc')
            v-list-tile-content
              v-list-tile-title {{ user.nickname }}
              v-list-tile-sub-title {{ user.email }}
          v-divider
          v-list-tile(:to="{ name: 'locale-profile' }", nuxt)
            v-list-tile-action
              v-icon account_circle
            v-list-tile-content {{ $t('profile') }}
          v-list-tile(:to="{ name: 'locale-sign-out', query: { 'ref': $route.name } }", nuxt)
            v-list-tile-action
              v-icon.layout-toolbar_sign-out-icon exit_to_app
            v-list-tile-content {{ $t('signOut') }}
        v-list(v-else)
          v-list-tile(:to="{ name: 'locale-register', query: { 'ref': $route.name } }", nuxt)
            v-list-tile-action
              v-icon account_circle
            v-list-tile-content {{ $t('register') }}
          v-list-tile(:to="{ name: 'locale-sign-in', query: { 'ref': $route.name } }", nuxt)
            v-list-tile-action
              v-icon exit_to_app
            v-list-tile-content {{ $t('signIn') }}
</template>

<script>
export default {
  name: 'LayoutToolbar',
  props: {
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
.layout-toolbar
  &_sign-out-icon
    transform rotate(180deg)

</style>

<i18n>
en:
  brand: Daisy
  register: Register
  signIn: Sign in
  signOut: Sign out
  profile: Profile
</i18n>
