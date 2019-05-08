import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';
import { toQueryParameterString, NullCheckProps } from '../../queryparams';

export function getProducts(keyword, category, deliveryLocation, collectionLocation, deliveryDate, collectionDate) {
  const params = toQueryParameterString(NullCheckProps({
    keyword, category, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
  }));
  console.log(params);
  const url = `https://c6z1cn1vpd.execute-api.eu-west-1.amazonaws.com/staging/api/v1/products?page=1&per_page=10${params}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
