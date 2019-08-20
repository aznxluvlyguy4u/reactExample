import { AUTH_ENDPOINT_BASE_URL } from '../requestConstants';
import RegisterRequest from '../../mapping/register/RegisterRequest';
import handleRestResponse from '../requestUtil';

export function registerUser(json) {
  const payload = new RegisterRequest(json).returnPostPayload();
  const url = `${AUTH_ENDPOINT_BASE_URL}/users/register`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(handleRestResponse);
}
