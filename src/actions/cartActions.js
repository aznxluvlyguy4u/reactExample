import { merge } from 'lodash';

export function addToCart(item) {
  return { type: 'ADD_TO_CART', payload: item };
}

export function removeFromCart(item) {
  return { type: 'REMOVE_TO_CART', payload: item };
}

export function emptyCart(item) {
  return { type: 'EMPTY_CART', item };
}

export function updateCart(state) {
  return { type: 'UPDATE_CART', count: state + 1 };
}

export function setCartCount(count) {
  return { type: 'UPDATE_CART', count };
}


export function setCart(cart) {
  return { type: 'SET_CART', payload: cart };
}
