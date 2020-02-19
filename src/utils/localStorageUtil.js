class LocalStorageUtil {

  constructor() {}

  setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCart() {
    const cart = localStorage.getItem('cart');
    if(cart) {
      return JSON.parse(cart);
    } else {
      return null;
    }
  }

  emptyCart() {
    localStorage.setItem('cart', JSON.stringify([]));
  }

  setCartItemPaid(cartItem) {
    localStorage.setItem('cartPaid', JSON.stringify(cartItem));
  }

  setCartItemPendingPayment(cartItem) {
    localStorage.setItem('cartPendingPaid', JSON.stringify(cartItem));
  }
 }

export default new LocalStorageUtil();
