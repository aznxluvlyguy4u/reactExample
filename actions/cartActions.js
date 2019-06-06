import { merge } from 'lodash';

export function updateCart(state) {
  return { type: 'UPDATE_CART', count: state + 1 };
}

export function setCartCount(count) {
  return { type: 'UPDATE_CART', count };
}
