import handleRestResponse from '../requestUtil';
import { BASE_URL } from '../requestConstants';

export function orderCartItems(body) { // Throttled function
  const url = `${BASE_URL}/products/orders`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleRestResponse);
}
