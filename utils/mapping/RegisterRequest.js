export default class RegisterRequest {
  constructor(state) {
    this.firstName = state.firstName;
    this.lastName = state.lastName;
    this.password = state.password;
    this.emailAddress = state.email;
    this.streetName = state.streetName;
    this.streetNumber = state.streetNumber;
    this.postalCode = state.postalCode;
    this.city = state.city;
    this.country = JSON.parse(state.country)
    this.addressAddition = state.addressAddition;
    this.phoneNumber = state.phoneNumber;
    this.phonePrefix = state.phonePrefix;
  }

  returnPostPayload() {
    return {
      "firstName": this.firstName,
      "lastName": this.lastName,
      "password": this.password,
      "emailAddress": this.emailAddress,
      "address": {
        "country" : {
          "alpha2code": this.country.alpha2Code,
          "callingCodes": this.country.callingCode,
          "name": this.country.name
        },
        "city": {
          "name": this.city
        },
        "streetName": this.streetName,
        "streetNumber": this.streetNumber,
        "streetBlock": this.addressAddition,
        "postalCode": this.postalCode,
        "phone": {
          "phoneNumber": this.phoneNumber,
          "countryCode": this.phonePrefix
        }
      },
    }
  }
}