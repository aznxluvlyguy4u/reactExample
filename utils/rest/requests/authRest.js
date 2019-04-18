import { DEV_URL, MOCK_URL } from "../requestConstants";
import RegisterRequest from "../../mapping/RegisterRequest";
import handleRestResponse from "../requestUtil";

export function registerUser(json) {
  const payload = new RegisterRequest(json).returnPostPayload();
    const url = `${MOCK_URL}/register`;
    return fetch(url, {
      method: 'POST',
      body: payload,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(handleRestResponse);
}