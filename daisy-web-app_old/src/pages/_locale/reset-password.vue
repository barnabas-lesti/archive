<template lang="pug">
  v-layout.pages-reset-password(row, wrap, justify-space-around)
    v-flex.mt-4.text-xs-center(xs12)
      h1 {{ $t('title') }}

    v-flex.text-xs-center(xs12)
      .pb-3(v-html="$t('description')")

    v-flex(shrink)
      v-card.pages-reset-password_card.pa-3
        v-card-text
          v-form(@submit.prevent='resetPassword()')
            v-layout(wrap)
              v-flex.py-0(xs12)
                v-scroll-y-transition(group)
                  .red--text.mt-2(v-for='error of serverErrors', :key='error') {{ error }}
              v-flex(xs12)
                v-text-field(v-model='$v.form.password.$model', :label="$t('password')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.password', type='password', append-icon='vpn_key', @change='updatePasswordErrors()')
                v-text-field(v-model='$v.form.passwordConfirmation.$model', :label="$t('passwordConfirmation')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.passwordConfirmation', type='password' append-icon='vpn_key', @change='updatePasswordConfirmationErrors()')
              v-flex.text-xs-right(xs12)
                v-btn.info.ma-0(type='submit', large) {{ $t('button') }}
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'PagesVerifyEmail',
  mixins: [ validationMixin ],
  middleware: 'signed-out',
  head () {
    return {
      title: this.$t('title'),
      meta: [ { name: 'description', content: this.$t('description') } ],
    };
  },
  data () {
    return {
      form: {
        password: '',
        passwordConfirmation: '',
      },
      fieldErrors: {
        password: [],
        passwordConfirmation: [],
      },
      serverErrors: [],
    };
  },
  validations () {
    return {
      form: {
        password: { required, minLength: minLength(6), maxLength: maxLength(22) },
        passwordConfirmation: { required, sameAs: sameAs(model => model.password) },
      },
    };
  },
  methods: {
    updatePasswordErrors () {
      const { password } = this.$v.form;
      this.fieldErrors.password = password.$dirty ? [
        ...(password.required ? [] : [this.$t('errors.password.required')]),
        ...(password.minLength && password.maxLength ? [] : [this.$t('errors.password.length',
          { min: password.$params.minLength.min, max: password.$params.maxLength.max })]),
      ] : [];
    },
    updatePasswordConfirmationErrors () {
      const { passwordConfirmation } = this.$v.form;
      this.fieldErrors.passwordConfirmation = passwordConfirmation.$dirty ? [
        ...(passwordConfirmation.required ? [] : [this.$t('errors.passwordConfirmation.required')]),
        ...(passwordConfirmation.sameAs ? [] : [this.$t('errors.passwordConfirmation.sameAs')]),
      ] : [];
    },
    updateErrors () {
      this.updatePasswordErrors();
      this.updatePasswordConfirmationErrors();
    },
    async resetPassword () {
      this.$v.form.$touch();
      this.updateErrors();
      if (!this.$v.form.$anyError) {
        this.$nuxt.$loading.start();
        this.$v.$reset();
        this.serverErrors.splice(0);
        try {
          await this.$axios.$patch('/api/auth/password', { token: this.$route.query['token'], password: this.form.password });
          this.form.password = this.form.passwordConfirmation = '';
          this.$store.commit('notifications/showSuccess', this.$t('notifications.resetSuccessful'));
          this.$router.push({ name: 'locale-sign-in' });
        } catch (ex) {
          const error = ex.response || ex;
          if (error.status === 401) {
            this.serverErrors.splice(0, 1, this.$t('errors.invalidToken'));
          } else {
            this.$store.commit('notifications/showError', this.$t('errors.serverError'));
            this.$logger.error(error);
          }
        }
        this.$nuxt.$loading.finish();
      }
    },
  },
};
</script>

<style lang="stylus">
.pages-reset-password
  &_card
    max-width 600px

</style>

<i18n>
en:
  title: Reset your password
  description: Please provide a new password for your account
  password: Password
  passwordConfirmation: Confirm your password
  button: Reset password
  notifications:
    resetSuccessful: Password changed, please sign in to your account
  errors:
    invalidToken: Reset failed, invalid token
    serverError: Sorry, an unexpected error occurred
    password:
      required: Password is required
      length: Password must be between {min} and {max} characters
    passwordConfirmation:
      required: Password confirmation is required
      sameAs: Passwords must match
</i18n>
