import { access } from 'fs';
import { isEmpty } from 'lodash';

export default class PlaceOrderRequest {
  constructor(cart, form) {
    console.log(cart);
    console.log(form);
    this.cart = cart;
    this.firstName = form.firstName;
    this.lastName = form.lastName;
    this.emailAddress = form.email;
    this.streetName = form.streetName;
    this.streetNumber = form.streetNumber;
    this.postalCode = form.postalCode;
    this.city = form.city;
    this.phoneNumber = form.phonePrefix + form.phoneNumber;
    this.comment = form.comment;
    this.addressAddition = form.addressAddition;
  }

  returnOrder() {
    const obj = {
      products: this.cart,
      contactDetails: {
        firstName: this.firstName,
        surName: this.lastName,
        emailAddress: this.emailAddress,
        phoneNumber: this.phoneNumber,
        address: {
          streetName: this.streetName,
          streetNumber: this.streetNumber,
          streetNumberBlock: this.addressAddition,
          postalCode: this.postalCode,
          country: 'bla',
          city: this.city,
        },
      },
      message: this.comment,
    };

    return obj;
  }
}
