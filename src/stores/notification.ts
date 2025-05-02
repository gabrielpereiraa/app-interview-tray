import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: null as string | null,
    type: null as string | null,
  }),
  persist: {
    storage: localStorage,
  },
  actions: {
    showNotification(message: string, type: string) {
      this.message = message;
      this.type = type;
      setTimeout(() => {
        this.clearNotification();
      }, 3000);
    },
    clearNotification() {
      this.message = null;
      this.type = null;
    },
  },
});