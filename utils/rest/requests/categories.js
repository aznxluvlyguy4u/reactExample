// /products/groups
import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

export function getCategories() {
  const url = `${BASE_URL}/products/groups`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
