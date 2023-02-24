import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      products: LocalStorage.getItem('products') ?? [],
      discount: LocalStorage.getItem('discount') ?? 0,
    }
  }),
  getters: {
    getCart: (state) => state.cart,
    getProducts: (state) => state.cart.products,
  },
  actions: {
    addProduct (payload) {
      const product = JSON.parse(JSON.stringify(payload.product))
      product.quantity = Number(payload.quantity);
      const existed = this.cart.products.findIndex(e => e.id == product.id);
      if (existed == -1) this.cart.products.push(product)
      else this.cart.products[existed].quantity += product.quantity
      LocalStorage.set('products', this.cart.products)
    },
    reduceProduct (payload) {
      const quantity = Number(payload.quantity)
      const product = JSON.parse(JSON.stringify(payload.product))
      const existed = this.cart.products.findIndex(e => e.id == product.id);
      if (existed == -1) return
      else {
        if (this.cart.products[existed].quantity > quantity) this.cart.products[existed].quantity -= quantity
        else this.cart.products.splice(existed, 1)
      }
      LocalStorage.set('products', this.cart.products)
    },
    applyDiscount (value) {
      this.cart.discount = Number(value)
      LocalStorage.set('discount', this.cart.discount)
    },
    updateProduct (product) {
      product = JSON.parse(JSON.stringify(product))
      const index = this.cart.products.findIndex(e => e.id == product.id);
      this.cart.products[index] = product
      LocalStorage.set('products', this.cart.products)
    },

    clear () {
      this.cart.products = []
      this.cart.discount = 0
      LocalStorage.set('products', this.cart.products)
      LocalStorage.set('discount', this.cart.discount)
    },
  },
});
