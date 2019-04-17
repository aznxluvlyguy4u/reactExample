export default class RegisterRequest {
  constructor(state) {
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.password = json.password;
    this.emailAddress = json.email;
    this.address = json.address;
  }

  returnPostPayload() {
    return {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "password": this.password,
      "emailAddress": this.emailAddress,
      "address": this.address,
    }
  }
}