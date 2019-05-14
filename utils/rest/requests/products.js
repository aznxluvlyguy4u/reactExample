import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';
import { toQueryParameterString, NullCheckProps } from '../../queryparams';

export function getProducts(keyword, category, deliveryLocation, collectionLocation, deliveryDate, collectionDate, page) {
  const params = toQueryParameterString(NullCheckProps({
    keyword, category, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
  }));
  let per_page = 8;
  if (page > 0) {
    per_page = 4;
  }
  const url = `${BASE_URL}/products/inventory?page=${page + 1}&per_page=${per_page}${params}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
