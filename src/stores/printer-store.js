import { defineStore } from 'pinia';

export const usePrinterStore = defineStore('printer', {
  state: () => ({
    printCharacteristic: null
  }),

  getters: {
    getPrinter (state) {
      return state.printCharacteristic
    }
  },

  actions: {
    setPrinter (characteristic) {
      this.printCharacteristic = characteristic;
    }
  }
})
