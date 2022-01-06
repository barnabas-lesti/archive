<template lang="pug">
  .pages-exercises-index
    base-modal(:value='modalMode', :title="$t(`modal.${ modal.model._id ? 'editTitle' : 'createTitle' }`)",
      @accept='saveExercise()', @discard='closeModal()')
      template(v-slot:content)
        v-form(@submit.prevent='saveExercise')
          v-card-text
            v-text-field(v-model='modal.model.content.name', :label="$t('name')")
            v-text-field(v-model='modal.model.duration.value', :label="$t('duration')", :suffix="$tc('units.mins', modal.model.duration.value)",
              type='number')
            v-text-field(v-model='modal.model.calorieBurn.value', :label="$t('calorieBurn')", :suffix="$t('units.kcal')",
              type='number')
            v-textarea(v-model='modal.model.content.description', :label="$t('description')", rows='10')

    v-layout(row, wrap)
      v-flex(xs12)
        base-control-title(:title="$t('page.title')")
          template(v-slot:controls)
            v-slide-x-reverse-transition
              v-btn.red.lighten-1(v-show='selection', fab, dark, small, @click='deleteExercise()')
                v-icon delete
            v-slide-x-reverse-transition
              v-btn.blue.lighten-1(v-show='selection', fab, dark, small, @click='openEditModal()')
                v-icon create
            v-btn.green.lighten-1(fab, dark, small, @click='openCreateModal()')
              v-icon add

      v-flex(xs12)
        v-form(@submit.prevent='onSearchFormSubmit()')
          v-text-field(v-model='searchString', :disabled='isLoading', :placeholder="$t('searchPlaceholder')",
          ref='searchInput', prepend-inner-icon='search', solo, clearable, autofocus, hide-details, @input='onSearchInput()')

      v-flex(xs12)
        exercises-table(v-model='selectedExercise', :exercises='exercises')

      base-fab
        template(v-slot:content)
          v-btn.green.lighten-1(fab, dark, small, @click='openCreateModal()')
            v-icon add
          v-btn.blue.lighten-1(v-if='selection', fab, dark, small, @click='openEditModal()')
            v-icon create
          v-btn.red.lighten-1(v-if='selection', fab, dark, small, @click='deleteExercise()')
            v-icon delete
</template>

<script>
import { mapState } from 'vuex';

import Exercise from '../../models/exercise';

import BaseControlTitle from '../../components/base/base-control-title';
import BaseFab from '../../components/base/base-fab';
import BaseModal from '../../components/base/base-modal';
import ExercisesTable from '../../components/exercises/exercises-table';

export default {
  name: 'PagesExercisesIndex',
  components: {
    BaseControlTitle,
    BaseFab,
    BaseModal,
    ExercisesTable,
  },
  head () {
    return {
      title: this.$t('page.title'),
      meta: [ { name: 'description', content: this.$t('page.description') } ],
    };
  },
  data () {
    return {
      modal: {
        model: new Exercise(),
      },
    };
  },
  computed: {
    ...mapState([ 'isLoading' ]),

    selection: {
      get () { return this.$route.query['selection']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'selection': newValue }); },
    },
    modalMode: {
      get () { return this.$route.query['modal']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'modal': newValue }); },
    },
    searchString: {
      get () { return this.$route.query['search']; },
      set (newValue) { this.$utils.pushRouteQuery({ 'search': newValue }); },
    },
    selectedExercise: {
      get () { return this.exercises.filter(item => item._id === this.selection)[0]; },
      set (newValue) { this.selection = newValue ? newValue._id : undefined; },
    },
  },

  methods: {
    openCreateModal () {
      this.modal.model = new Exercise();
      this.modalMode = 'create';
    },
    openEditModal () {
      this.modal.model = new Exercise(this.exercises.filter(item => item._id === this.selection)[0]);
      this.modalMode = 'edit';
    },
    closeModal () {
      this.modalMode = undefined;
    },
    onTableSelect ({ _id: id }) {
      this.selection = id !== this.$route.query.selection ? id : undefined;
    },
    onSearchInput () {
      if (this._searchInputTimeoutId) {
        window.clearTimeout(this._searchInputTimeoutId);
      }
      this._searchInputTimeoutId = window.setTimeout(() => this.onSearchFormSubmit(), 300);
    },
    async onSearchFormSubmit () {
      await this.fetchExercises();
      this.$nextTick(() => this.$refs.searchInput.focus());
    },
    async fetchExercises () {
      this.$store.commit('startLoading');
      try {
        const response = await this.$axios.$get('/api/exercises', { params: { search: this.searchString } });
        this.exercises = response.map(item => new Exercise(item));
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
    async deleteExercise () {
      this.$store.commit('startLoading');
      try {
        await this.$axios.$delete(`/api/exercises/${this.selection}`);
        this.$store.commit('notifications/showSuccess', this.$t('notifications.deleted'));
        this.selection = undefined;
        await this.fetchExercises();
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
    async saveExercise () {
      this.$store.commit('startLoading');
      try {
        if (this.modal.model._id) {
          await this.$axios.$patch(`/api/exercises/${this.modal.model._id}`, this.modal.model);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.updated'));
        } else {
          await this.$axios.$put('/api/exercises', this.modal.model);
          this.$store.commit('notifications/showSuccess', this.$t('notifications.created'));
        }
        this.modal.model = new Exercise();
        this.closeModal();
        await this.fetchExercises();
      } catch (ex) {
        this.$store.commit('notifications/showError', this.$t('notifications.unknownErrorOccurred'));
      }
      this.$store.commit('finishLoading');
    },
  },

  async asyncData ({ route, error, $axios }) {
    try {
      const response = await $axios.$get('/api/exercises', { params: { search: route.query['search'] } });
      return { exercises: response.map(item => new Exercise(item)) };
    } catch (ex) {
      error({ statusCode: ex.response.status });
    }
  },
  mounted () {
    if (this.modalMode === 'edit') {
      this.openEditModal();
    }
  },
};
</script>

<i18n>
en:
  searchPlaceholder: Search exercises
  name: Name
  calorieBurn: Calorie Burn
  duration: Duration
  description: Description
  page:
    title: Exercises
    description: List of exercises
  units:
    kcal: kcal
    mins: min | mins
  modal:
    createTitle: Create exercise
    editTitle: Edit exercise
  notifications:
    created: Exercise successfully created
    updated: Exercise successfully updated
    deleted: Exercise successfully deleted
</i18n>
