import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

function returnCorrectURL(keyword, category_id) {
  if (keyword !== undefined && category_id === undefined) {
    return `${BASE_URL}/products?page=1&per_page=10&q[name_or_product_group_name_or_product_tags_name_cont]=${keyword}`;
  } if (keyword === undefined && category_id !== undefined) {
    return `${BASE_URL}/products??page=1&per_page=10&q[product_group_id_eq]=${category_id}`;
  }
}

export function getProducts(keyword, category_id) {
  returnCorrectURL(keyword, category_id);
  const url = returnCorrectURL(keyword, category_id);
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
