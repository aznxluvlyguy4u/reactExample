// /products/groups
import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

export function getCategories() {
  const url = 'https://c6z1cn1vpd.execute-api.eu-west-1.amazonaws.com/staging/api/v1/products/groups';
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
