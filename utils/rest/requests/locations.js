import { BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

export function getLocations() {
  const url = 'https://7s2c5akwy2.execute-api.eu-west-1.amazonaws.com/staging/api/v1/locations';
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
