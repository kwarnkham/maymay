import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    setUser (payload) {
      this.user = payload;
    },
  },
});
