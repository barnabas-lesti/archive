<template lang="pug">
  v-layout.pages-sign-in(row, wrap, justify-space-around)
    v-flex.mt-4(xs12).text-xs-center
      h1 {{ $t('title') }}

    v-flex(xs12).text-xs-center
      .pb-3(v-html="$t('descriptionHtml')")

    v-flex(shrink)
      v-card.pages-sign-in_card.pa-3
        v-card-text
          v-form(@submit.prevent='signIn()')
            v-layout(wrap)
              v-flex.py-0(xs12)
                v-scroll-y-transition(group)
                  .red--text.mt-2(v-for='error of serverErrors', :key='error') {{ error }}
              v-flex(xs12)
                v-text-field(v-model='$v.form.email.$model', :label="$t('email')", :error='!!serverErrors.length',
                  :error-messages="fieldErrors.email", type='email', append-icon='account_circle', name='email', @change='updateEmailErrors()')
                v-text-field(v-model='$v.form.password.$model', :error='!!serverErrors.length', :error-messages="fieldErrors.password",
                  :label="$t('password')", type='password', append-icon='vpn_key', name='password', @change='updatePasswordErrors()')
              v-flex(xs12)
                nuxt-link.d-block.mb-2(:to="{ name: 'locale-register' }") {{ $t('registrationLink') }}
                a.d-block(href='#', @click.prevent='sendPasswordResetEmail()') {{ $t('forgotPassword') }}
              v-flex.text-xs-right(xs12)
                v-btn.info.ma-0(type='submit', large) {{ $t('button') }}
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'PagesSignIn',
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
        email: '',
        password: '',
      },
      fieldErrors: {
        email: [],
        password: [],
      },
      serverErrors: [],
    };
  },
  validations: {
    form: {
      email: { required, email },
      password: { required },
    },
  },
  methods: {
    updateEmailErrors () {
      const { email } = this.$v.form;
      this.fieldErrors.email = email.$dirty ? [
        ...(email.required ? [] : [this.$t('errors.email.required')]),
        ...(email.email ? [] : [this.$t('errors.email.email')]),
      ] : [];
    },
    updatePasswordErrors () {
      const { password } = this.$v.form;
      this.fieldErrors.password = password.$dirty ? [ ...(password.required ? [] : [this.$t('errors.password.required')]) ] : [];
    },
    updateErrors () {
      this.updateEmailErrors();
      this.updatePasswordErrors();
    },
    async signIn () {
      const { email, password } = this.form;
      this.$v.form.$touch();
      this.updateErrors();
      if (!this.$v.form.$anyError) {
        this.$nuxt.$loading.start();
        this.serverErrors.splice(0);
        try {
          await this.$auth.signIn(email, password);
          this.form.email = this.form.password = '';
          this.$v.$reset();
          this.$store.commit('notifications/showInfo', { html: this.$t('notifications.signInSuccessful', { email }) });
          this.$router.push({ name: this.$route.query['ref'] || 'locale' });
        } catch (ex) {
          const error = ex.response || ex;
          if (error.status === 401) {
            this.serverErrors.splice(0, 1, this.$t('errors.authenticationFailed'));
          } else {
            this.$store.commit('notifications/showError', this.$t('errors.serverError'));
            this.$logger.error(error);
          }
        }
        this.$nuxt.$loading.finish();
      }
    },
    async sendPasswordResetEmail () {
      this.$v.form.email.$touch();
      this.updateEmailErrors();
      if (!this.$v.form.email.$anyError) {
        this.$nuxt.$loading.start();
        this.serverErrors.splice(0);
        const { email } = this.form;
        const { locale } = this.$store.state.i18n;
        try {
          await this.$axios.$post('/api/auth/send-password-reset-email', { email, locale });
          this.form.email = this.form.password = '';
          this.$v.$reset();
          this.$store.commit('notifications/showInfo', { html: this.$t('notifications.passwordResetEmailSent', { email }) });
        } catch (ex) {
          const error = ex.response || ex;
          if (error.status === 404) {
            this.serverErrors.splice(0, 1, this.$t('errors.userNotFound'));
          } else {
            this.$store.commit('notifications/showError', this.$t('errors.serverError'));
            this.$logger.error(ex);
          }
        }
        this.$nuxt.$loading.finish();
      }
    },
  },
};
</script>

<style lang="stylus">
.pages-sign-in
  &_card
    max-width 600px

</style>

<i18n>
en:
  title: Sign in
  description: Sign in to your account to access the cool features of Daisy!
  descriptionHtml: "Sign in to your account to access the cool features of <strong>Daisy</strong>!"
  email: Email
  password: Password
  button: Sign in
  cancel: Cancel
  registrationLink: Don't have an account? Register!
  forgotPassword: Forgot your password?
  errors:
    authenticationFailed: Sign in failed, invalid credentials
    serverError: Sorry, an unexpected error occurred
    userNotFound: User with given email address does not exist
    email:
      required: Email is required
      email: Email format is invalid
    password:
      required: Password is required
  notifications:
    signInSuccessful: "Signed in as <strong>{email}</strong>."
    passwordResetEmailSent: "Password reset email sent to <strong>{email}</strong>, please check your inbox."
</i18n>
