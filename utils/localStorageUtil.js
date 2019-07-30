class LocalStorageUtil {

  constructor() {}

  setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCart() {
    const cart = localStorage.getItem('cart');
    return  JSON.parse(cart);
  }

  emptyCart() {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

export default new LocalStorageUtil();
