import { merge } from 'lodash';

export function updateCartObject(cart, updatedcart) {
  const newobj = merge(cart, updatedcart);
  console.log(newobj);
  console.log(updatedsearch);
  return { type: 'UPDATE_CART', cart };
}
