<template lang="pug">
  .pages-sign-out
</template>

<script>

export default {
  name: 'PagesSignOut',
  middleware: 'signed-in',
  head () {
    return {
      title: this.$t('title'),
    };
  },
  created () {
    const ref = this.$route.query['ref'];
    this.$auth.signOut();
    this.$router.push({ name: ref || 'locale-sign-in' });
  },
};
</script>

<i18n>
en:
  title: Signing out...
</i18n>
