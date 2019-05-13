import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';
import { toQueryParameterString, NullCheckProps } from '../../queryparams';

export function getProducts(keyword, category, deliveryLocation, collectionLocation, deliveryDate, collectionDate) {
  const params = toQueryParameterString(NullCheckProps({
    keyword, category, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
  }));
  const url = `${BASE_URL}/products/inventory${params}`;
  console.log(url);
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
