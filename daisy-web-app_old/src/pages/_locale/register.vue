<template lang="pug">
  v-layout.pages-register(row, wrap, justify-space-around)
    v-flex.mt-4.text-xs-center(xs12)
      h1 {{ $t('title') }}

    v-flex.text-xs-center(xs12)
      .pb-3(v-html="$t('descriptionHtml')")

    v-flex(shrink)
      v-card.pages-register_card.pa-3
        v-card-text
          v-form(@submit.prevent='sendRegistrationEmail()')
            v-layout(wrap)
              v-flex.py-0(xs12)
                v-scroll-y-transition(group)
                  .red--text.mt-2(v-for='error of serverErrors', :key='error') {{ error }}
              v-flex(xs12)
                v-text-field(v-model='$v.form.nickname.$model', :label="$t('nickname')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.nickname', type='text' append-icon='face', @change='updateNicknameErrors()')
                v-text-field(v-model='$v.form.email.$model', :label="$t('email')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.email', type='email' append-icon='account_circle', @change='updateEmailErrors()')
                v-text-field(v-model='$v.form.password.$model', :label="$t('password')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.password', type='password', append-icon='vpn_key', @change='updatePasswordErrors()')
                v-text-field(v-model='$v.form.passwordConfirmation.$model', :label="$t('passwordConfirmation')", :error='!!serverErrors.length',
                  :error-messages='fieldErrors.passwordConfirmation', type='password' append-icon='vpn_key', @change='updatePasswordConfirmationErrors()')
              v-flex(xs12)
                nuxt-link(:to="{ name: 'locale-sign-in' }") {{ $t('signInLink') }}
              v-flex.text-xs-right(xs12)
                v-btn.info.ma-0(type='submit', large) {{ $t('button') }}
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'PagesRegister',
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
        nickname: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      fieldErrors: {
        nickname: [],
        email: [],
        password: [],
        passwordConfirmation: [],
      },
      serverErrors: [],
    };
  },
  validations () {
    return {
      form: {
        nickname: { required },
        email: { required, email },
        password: { required, minLength: minLength(6), maxLength: maxLength(22) },
        passwordConfirmation: { required, sameAs: sameAs(model => model.password) },
      },
    };
  },
  methods: {
    updateNicknameErrors () {
      const { nickname } = this.$v.form;
      this.fieldErrors.nickname = nickname.$dirty ? [
        ...(nickname.required ? [] : [this.$t('errors.nickname.required')]),
      ] : [];
    },
    updateEmailErrors () {
      const { email } = this.$v.form;
      this.fieldErrors.email = email.$dirty ? [
        ...(email.required ? [] : [this.$t('errors.email.required')]),
        ...(email.email ? [] : [this.$t('errors.email.email')]),
      ] : [];
    },
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
      this.updateNicknameErrors();
      this.updateEmailErrors();
      this.updatePasswordErrors();
      this.updatePasswordConfirmationErrors();
    },
    async sendRegistrationEmail () {
      this.$v.form.$touch();
      this.updateErrors();
      if (!this.$v.form.$anyError) {
        this.$nuxt.$loading.start();
        this.$v.$reset();
        this.serverErrors.splice(0);
        const { email, password, nickname } = this.form;
        const { locale } = this.$store.state.i18n;
        try {
          await this.$axios.$post('/api/auth/send-registration-email', { email, password, nickname, locale });
          this.form.nickname = this.form.email = this.form.password = this.form.passwordConfirmation = '';
          this.$store.commit('notifications/showInfo', { html: this.$t('notifications.registrationEmailSent', { email }) });
          this.$router.push({ name: this.$route.query['ref'] || 'locale' });
        } catch (ex) {
          const error = ex.response || ex;
          if (error.status === 409) {
            this.serverErrors.splice(0, 1, this.$t('errors.emailAlreadyInUse'));
          } else if (error.status === 400) {
            this.serverErrors.splice(0, 1, this.$t('errors.badRequest'));
          } else {
            this.$store.commit('notifications/showError', this.$t('errors.serverError'));
            this.$logger.error(error);
          }
        }
        this.$nuxt.$loading.finish();
      }
    },
    async register (token) {
      this.$nextTick(() => this.$nuxt.$loading.start());
      try {
        await this.$axios.$post('/api/auth/register', { token });
        this.$store.commit('notifications/showSuccess', { html: this.$t('notifications.registrationSuccessful') });
        this.$router.push({ name: 'locale-sign-in' });
      } catch (ex) {
        const error = ex.response || ex;
        if (error.status === 401 || error.status === 400) {
          this.$store.commit('notifications/showError', this.$t('errors.tokenInvalid'));
        } else if (error.status === 409) {
          this.$store.commit('notifications/showError', this.$t('errors.emailAlreadyInUse'));
        } else {
          this.$store.commit('notifications/showError', this.$t('errors.serverError'));
          this.$logger.error(error);
        }
        this.$utils.pushRouteQuery({ 'token': undefined });
      }
      this.$nuxt.$loading.finish();
    },
  },
  mounted () {
    const token = this.$route.query['token'];
    if (token) {
      this.register(token);
    }
  },
};
</script>

<style lang="stylus">
.pages-register
  &_card
    max-width 600px

</style>

<i18n>
en:
  title: Register
  description: Register an account to access the cool features of Daisy!
  descriptionHtml: "Register an account to access the cool features of <strong>Daisy</strong>!"
  nickname: Nickname
  email: Email
  password: Password
  passwordConfirmation: Confirm your password
  button: Register
  signInLink: Already have an account? Sign in!
  notifications:
    registrationEmailSent: "Registration email sent to <strong>{email}</strong>, please check your inbox"
    registrationSuccessful: Registration successful, please sign in
  errors:
    emailAlreadyInUse: Email already in use
    serverError: Sorry, an unexpected error occurred
    tokenInvalid: Token invalid, maybe you waited for too long?
    badRequest: Some information is invalid, is the email address valid?
    nickname:
      required: Nickname is required
    email:
      required: Email is required
      email: Email format is invalid
    password:
      required: Password is required
      length: Password must be between {min} and {max} characters
    passwordConfirmation:
      required: Password confirmation is required
      sameAs: Passwords must match
</i18n>
