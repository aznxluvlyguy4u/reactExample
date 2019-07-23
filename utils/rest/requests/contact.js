import handleRestResponse from '../requestUtil';
import { BASE_URL } from '../requestConstants';

export function postContactMessage(contactRequest) {
  // https://s7cnld7i7c.execute-api.eu-west-1.amazonaws.com/dev/api/v1/offices/OFFICE_ID/enquiries
  const url = `${BASE_URL}/offices/${contactRequest.office.value}/enquiries`;
  let request = contactRequest;
  request.office = contactRequest.office.value

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }).then(handleRestResponse);
}
