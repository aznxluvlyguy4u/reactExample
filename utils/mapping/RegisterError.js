export default class RegisterError {
  constructor(json) {
    console.log('registererror')
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    // this.password = state.password;
    this.email = json.emailAddress;
    // this.streetName = state.streetName;
    this.streetNumber = json.address.streetNumber;
    this.postalCode = json.address.postalCode;
    this.city = state.address.city;
    this.country = json.address.country;
    this.addressAddition = state.address.streetBlock;
    this.phoneNumber = json.phone.phoneNumber;
    // this.phonePrefix = state.phonePrefix;
  }
  returnResponsePayload() {
    console.log('returnresponsepayload')
    return {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "city": this.city,
      "streetNumber": this.streetNumber,
      "country": this.country,
      "phoneNumber": this.phoneNumber,
      "postalCode": this.postalCode,
      "addressAddition": this.addressAddition
    }
  }
}