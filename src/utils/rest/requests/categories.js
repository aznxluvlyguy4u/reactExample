// /products/groups
import { PRODUCTS_ENDPOINT_BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';
import 'whatwg-fetch';

export function getCategories() {
  const url = `${PRODUCTS_ENDPOINT_BASE_URL}/products/groups`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
