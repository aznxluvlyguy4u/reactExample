import handleRestResponse from '../requestUtil';
import { OFFICES_ENDPOINT_BASE_URL } from '../requestConstants';

export function postContactMessage(contactRequest) {
  const url = `${OFFICES_ENDPOINT_BASE_URL}/offices/1/enquiries`;

  let request = contactRequest;
  request.office = {
    id: 1,
    name: '',
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(handleRestResponse);
}
