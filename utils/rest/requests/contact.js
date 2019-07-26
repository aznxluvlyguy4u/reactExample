import handleRestResponse from '../requestUtil';
import { BASE_URL } from '../requestConstants';
import contact from '../../../pages/contact';

export function postContactMessage(contactRequest) {
  const url ='https://s7cnld7i7c.execute-api.eu-west-1.amazonaws.com/dev/api/v1/offices/1/enquiries';
  // const url = `${BASE_URL}/offices/${contactRequest.office.value}/enquiries`;

  let request = contactRequest;
  request.office = {
    id: contactRequest.office.value.id,
    name: contactRequest.office.value.name
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
