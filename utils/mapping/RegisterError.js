export default class RegisterError {
  constructor(json) {
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.email = json.emailAddress;
    this.streetNumber = json.address.streetNumber;
    this.postalCode = json.address.postalCode;
    this.city = json.address.city;
    this.country = json.address.country;
    this.addressAddition = json.address.streetBlock;
    this.phoneNumber = json.address.phone.phoneNumber;
    this.phonePrefix = json.address.phone.countryCode;
  }

  returnResponsePayload() {
    return {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "city": this.city,
      "streetNumber": this.streetNumber,
      "country": this.country,
      "phoneNumber": this.phoneNumber,
      "postalCode": this.postalCode,
      "addressAddition": this.addressAddition,
      "phonePrefix": this.phonePrefix
    }
  }
}