import handleRestResponse from '../requestUtil';

export function orderCartItems(body) { // Throttled function
  const url = 'https://1qie0vagy1.execute-api.eu-west-1.amazonaws.com/dev/api/v1/products/orders';
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleRestResponse);
}
