import handleRestResponse from '../requestUtil';

export function checkCartAvailability(cart) { // Throttled function
  const url = 'https://1qie0vagy1.execute-api.eu-west-1.amazonaws.com/dev/api/v1/products/availability';
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cart),
  }).then(handleRestResponse);
}
