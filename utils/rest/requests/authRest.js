import { LOCAL_URL } from '../requestConstants';
import RegisterRequest from '../../mapping/RegisterRequest';
import handleRestResponse from '../requestUtil';

export function registerUser(json) {
  const payload = new RegisterRequest(json).returnPostPayload();
  const url = `${LOCAL_URL}/users/register`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(handleRestResponse);
}
