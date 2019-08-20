export default class PlaceOrderRequest {
  constructor(cart, form) {
    this.cart = cart;
    this.firstName = form.firstName;
    this.lastName = form.lastName;
    this.emailAddress = form.email;
    this.phoneNumber = form.phonePrefix + form.phoneNumber;
    this.comment = form.comment;
    this.affiliation = form.affiliation.value;
    this.yachtName = form.yachtname;
  }

  returnOrder() {
    const obj = {
      products: this.cart,
      yachtName: this.yachtName,
      contactDetails: {
        firstName: this.firstName,
        surName: this.lastName,
        emailAddress: this.emailAddress,
        phoneNumber: this.phoneNumber,
        type: this.affiliation,
      },
      message: this.comment,
    };

    return obj;
  }
}
