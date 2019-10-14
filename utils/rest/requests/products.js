import { throttle, debounce } from 'throttle-debounce';
import { PRODUCTS_ENDPOINT_BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';
import { toQueryParameterString, NullCheckProps } from '../../queryparams';
import 'whatwg-fetch';

function requestAllWithDelay(urls, delay) {
  return urls.reduce((promise, url) => promise
    .then(responses => fetch(url) // Or whatever request library you're using. If it doesn't support promises, you can wrap it in `new Promise((resolve, reject) => someLib(url, { onSuccess: resolve, onError: reject }));` or something similar.
      .then(response => new Promise((resolve) => {
        setTimeout(resolve, delay, responses.concat(response)); // replies.concat might not work, depending on how you want to accumulate all the data. Maybe you don't even care about the responses?
      }))), Promise.resolve([]));
}

export function getProducts(keyword, category, deliveryLocation, collectionLocation, deliveryDate, collectionDate, page) { // Throttled function
  const params = toQueryParameterString(NullCheckProps({
    keyword, category, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
  }));
  const per_page = 100;
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/inventory?page=${page + 1}&per_page=${per_page}${params}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}

export function getFirstProducts(category) {
  const per_page = 5;
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/inventory?q[product_group_id_eq]=${category}&?page=1&per_page=${per_page}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}

export function getProductById(id, deliveryLocation) {

  let params = '';
  if (deliveryLocation) {
    params = `?delivery_location_id=${deliveryLocation}`;
  }

  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/${id}${params}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
