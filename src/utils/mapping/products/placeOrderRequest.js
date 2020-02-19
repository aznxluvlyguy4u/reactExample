export default class PlaceOrderRequest {
  constructor(location, period, products, contactInformation, contracterInformation, paymentMethod) {
    this.paymentMethod = paymentMethod;
    this.products = products.map((product) => {
      return {
        id: product.id,
        accessories: product.accessories,
        quantity: product.quantity,
        location,
        period,
      };
    });
    this.securityDepositConsent = contracterInformation.securityDepositConsent;
    this.termsAndConditionsConsent = contracterInformation.termsAndConditionsConsent;
    this.contactDetails = {
      firstName: contactInformation.firstName,
      surName: contactInformation.surname,
      emailAddress: contactInformation.emailAddress,
      phoneNumber: contactInformation.phoneNumber, //contactInformation.phonePrefix +
      type: contactInformation.affiliation.value,
    };
    this.contracterDetails = {
      firstName: contracterInformation.firstName,
      surName: contracterInformation.surname,
      emailAddress: contracterInformation.emailAddress,
      billing: {
        companyName: contracterInformation.company,
        vatNumber: contracterInformation.vatNumber,
        address: {
          streetName: contracterInformation.streetName,
          streetNumber: contracterInformation.streetNumber,
          streetNumberBlock: contracterInformation.streetNumberBlock,
          postalCode: contracterInformation.postalCode,
          country: contracterInformation.country,
        },
      },
    };
    this.affiliation = contactInformation.affiliation.value;
    this.comment = contactInformation.comment;
    this.yachtName = contactInformation.yachtname;
  }

  returnOrder() {
    const obj = {
      paymentMethod: this.paymentMethod,
      products: this.products,
      yachtName: this.yachtName,
      securityDepositConsent: this.securityDepositConsent,
      termsAndConditionsConsent: this.termsAndConditionsConsent,
      contactDetails: this.contactDetails,
      contractorDetails: this.contracterDetails,
      message: this.comment,
    };

    return obj;
  }
}
