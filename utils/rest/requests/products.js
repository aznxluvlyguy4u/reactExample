import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

export function getProducts(keyword) {
  const url = `${BASE_URL}/products?page=1&per_page=2&q[name_or_product_group_name_or_product_tags_name_cont]=seabob`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
