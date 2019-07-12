import { LOCATIONS_ENDPOINT_BASE_URL } from '../requestConstants';
import handleRestResponse from '../requestUtil';

export function getLocations() {
  const url = `${LOCATIONS_ENDPOINT_BASE_URL}/locations`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(handleRestResponse);
}
