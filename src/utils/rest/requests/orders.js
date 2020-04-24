import handleRestResponse from '../requestUtil';
import { PRODUCTS_ENDPOINT_BASE_URL } from '../requestConstants';
import 'whatwg-fetch';

export function createPaymentIntent(body) { // Throttled function
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/orders/create-payment-intent`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleRestResponse);
}

export function orderCartItems(body) { // Throttled function
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/orders`;
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleRestResponse);
}

export function updateOrderCartItems(body) { // Throttled function
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/orders`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleRestResponse);
}
