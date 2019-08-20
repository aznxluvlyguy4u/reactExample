import handleRestResponse from '../requestUtil';
import { PRODUCTS_ENDPOINT_BASE_URL } from '../requestConstants';

export function checkCartAvailability(cart) { // Throttled function
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/availability`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cart),
  }).then(handleRestResponse);
}
