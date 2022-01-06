<template lang="pug">
  v-layout.pages-profile(row, wrap, justify-space-around)
    v-flex.text-xs-center(xs12)
      h1 {{ $t('title', { nickname: user.nickname }) }}

    v-flex.text-xs-center.text-lg-left(xs12, lg3)
      v-avatar.pages-profile_avatar.elevation-3.mb-3(size='240', @click='onProfileImageClick()')
        v-img(:src='profileImageSrc')
      .font-italic {{ $t('clickToEdit') }}

    v-flex(xs12, lg9)
      h3.mb-2 {{ $t('general') }}
      v-form(@submit.prevent='updateProfile()')
        v-text-field(:value='user.email', :label='$t("forms.profile.email")',
          type='email', disabled)
        v-text-field(v-model='$v.forms.profile.nickname.$model', :label='$t("forms.profile.nickname")',
          :error-messages='errors.profile.nickname', type='text', @change='updateErrors("nickname")')
        .text-xs-right(xs12)
          v-btn.info.ma-0(type='submit') {{ $t('forms.profile.submit') }}

      h3.mb-2 {{ $t('changePassword') }}
      v-form(@submit.prevent='changePassword()')
        v-text-field(v-model='$v.forms.password.password.$model', :label='$t("forms.password.password")',
          :error-messages='errors.password.password',
          type='password', @change='updateErrors("password")')
        v-text-field(v-model='$v.forms.password.passwordConfirmation.$model', :label='$t("forms.password.passwordConfirmation")',
          :error-messages='errors.password.passwordConfirmation',
          type='password' @change='updateErrors("passwordConfirmation")')
        .text-xs-right(xs12)
          v-btn.info.ma-0(type='submit') {{ $t('forms.password.submit') }}

    base-modal(v-model='isModalOpen', :title='$t("modal.title")', max-width='432', @accept='confirmProfileImageUpdate()',
      @discard='discardProfileImageUpdate()')
      v-container(grid-list-xl)
        v-layout(row, wrap)
          v-flex(xs12)
            v-img.elevation-3(:src='modal.imageSrc || "/images/no-profile-image.png"')
          v-flex(xs12)
            v-text-field(v-model='modal.profileImageUrl', :label='$t("modal.profileImageUrl")',
              type='text', @change='modal.imageSrc = modal.profileImageUrl;')
          v-flex.text-xs-right(xs12)
            v-btn.ma-0.mr-3(@click='discardProfileImageUpdate()') {{ $t('modal.discard') }}
            v-btn.info.ma-0(@click='confirmProfileImageUpdate()') {{ $t('modal.confirm') }}
</template>

<script>
import { mapState } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

import BaseModal from '../../components/base/base-modal';

export default {
  name: 'PagesProfile',
  mixins: [ validationMixin ],
  middleware: 'signed-in',
  components: {
    BaseModal,
  },
  head () {
    const { nickname } = this.user;
    return {
      title: this.$t('title', { nickname }),
      meta: [ { name: 'description', content: this.$t('description', { nickname }) } ],
    };
  },
  data () {
    const { nickname, profileImageUrl } = this.$store.state.user.user;
    return {
      isModalOpen: false,
      modal: {
        imageSrc: profileImageUrl,
        profileImageUrl,
      },
      forms: {
        profile: { nickname, profileImageUrl },
        password: { password: '', passwordConfirmation: '' },
      },
      errors: {
        profile: { nickname: [] },
        password: { password: [], passwordConfirmation: [] },
      },
    };
  },
  validations () {
    return {
      forms: {
        profile: { nickname: { required }, profileImageUrl: {} },
        password: {
          password: { required, minLength: minLength(6), maxLength: maxLength(22) },
          passwordConfirmation: { required, sameAs: sameAs(model => model.password) },
        },
      },
    };
  },
  computed: {
    ...mapState('user', [ 'user', 'accessToken' ]),
    profileImageSrc () { return (this.user && this.user.profileImageUrl) || '/images/no-profile-image.png'; },
  },
  methods: {
    onProfileImageClick () {
      this.isModalOpen = true;
    },
    confirmProfileImageUpdate () {
      this.forms.profile.profileImageUrl = this.modal.profileImageUrl;
      this.$store.commit('user/updateUser', { profileImageUrl: this.modal.profileImageUrl || null });
      this.isModalOpen = false;
    },
    discardProfileImageUpdate () {
      this.modal.imageSrc = this.modal.profileImageUrl = this.forms.profile.profileImageUrl;
      this.isModalOpen = false;
    },
    updateErrors (args = [ 'nickname', 'password', 'passwordConfirmation' ]) {
      const fields = Array.isArray(args) ? args : [ args ];
      if (fields.includes('nickname')) {
        const { nickname } = this.$v.forms.profile;
        this.errors.profile.nickname = nickname.$dirty ? [
          ...(nickname.required ? [] : [this.$t('errors.profile.nickname.required')]),
        ] : [];
      }
      if (fields.includes('password')) {
        const { password } = this.$v.forms.password;
        this.errors.password.password = password.$dirty ? [
          ...(password.required ? [] : [this.$t('errors.password.password.required')]),
          ...(password.minLength && password.maxLength ? [] : [this.$t('errors.password.password.length',
            { min: password.$params.minLength.min, max: password.$params.maxLength.max })]),
        ] : [];
      }
      if (fields.includes('passwordConfirmation')) {
        const { passwordConfirmation } = this.$v.forms.password;
        this.errors.password.passwordConfirmation = passwordConfirmation.$dirty ? [
          ...(passwordConfirmation.required ? [] : [this.$t('errors.password.passwordConfirmation.required')]),
          ...(passwordConfirmation.sameAs ? [] : [this.$t('errors.password.passwordConfirmation.sameAs')]),
        ] : [];
      }
    },
    async updateProfile () {
      this.$v.forms.profile.$touch();
      this.updateErrors('nickname');
      if (!this.$v.forms.profile.$anyError) {
        this.$nuxt.$loading.start();
        this.$v.forms.profile.$reset();
        try {
          await this.$axios.$patch('/api/auth/profile', this.forms.profile);
          this.$store.commit('user/updateUser', this.forms.profile);
          this.$store.commit('notifications/showInfo', { html: this.$t('notifications.profile.updated') });
        } catch (ex) {
          this.$store.commit('notifications/showError', this.$t('errors.serverError'));
          this.$logger.error(ex);
        }
        this.$nuxt.$loading.finish();
      }
    },
    async changePassword () {
      this.$v.forms.password.$touch();
      this.updateErrors([ 'password', 'passwordConfirmation' ]);
      if (!this.$v.forms.password.$anyError) {
        this.$nuxt.$loading.start();
        this.$v.forms.password.$reset();
        const { password } = this.forms.password;
        try {
          await this.$axios.$patch('/api/auth/password', { token: this.accessToken, password });
          this.forms.password.password = this.forms.password.passwordConfirmation = '';
          this.$store.commit('notifications/showInfo', { html: this.$t('notifications.password.updated') });
        } catch (ex) {
          this.$store.commit('notifications/showError', this.$t('errors.serverError'));
          this.$logger.error(ex);
        }
        this.$nuxt.$loading.finish();
      }
    },
  },
};
</script>

<style lang="stylus">
.pages-profile
  &_avatar
    cursor pointer

</style>

<i18n>
en:
  title: "{nickname}'s profile"
  description: "{nickname}'s profile page"
  clickToEdit: Click to edit profile image
  general: General
  changePassword: Change password
  forms:
    profile:
      email: Email
      nickname: Nickname
      submit: Update profile
    password:
      password: Password
      passwordConfirmation: Confirm your password
      submit: Change password
  modal:
    title: Update profile image
    profileImageUrl: Profile Image URL
    confirm: Change image
    discard: Discard
  notifications:
    profile:
      updated: Profile successfully updated
    password:
      updated: Password successfully updated
  errors:
    serverError: Sorry, an unexpected error occurred
    profile:
      nickname:
        required: Nickname is required
    password:
      password:
        required: Password is required
        length: Password must be between {min} and {max} characters
      passwordConfirmation:
        required: Password confirmation is required
        sameAs: Passwords must match
</i18n>
