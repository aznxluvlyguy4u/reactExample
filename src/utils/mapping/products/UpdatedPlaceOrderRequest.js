
export default class UpdatedPlaceOrderRequest {
  constructor(originalRequest, products, contactInformation, contracterInformation) {
    this.products = products;
    this.originalRequest = originalRequest;
    // this.contactDetails = contactInformation;
    // this.contractorDetails = contracterInformation;
    this.contactDetails = {
      firstName: contactInformation.firstName,
      surName: contactInformation.surName,
      emailAddress: contactInformation.emailAddress,
      phoneNumber: contactInformation.phoneNumber, //contactInformation.phonePrefix +
      type: contactInformation.affiliation.value
    }
    this.contracterDetails = {
      firstName: contracterInformation.firstName,
      surName: contracterInformation.surName,
      emailAddress: contracterInformation.emailAddress,
      billing: {
        companyName: contracterInformation.company,
        vatNumber: contracterInformation.vatNumber,
        address: {
          streetName: contracterInformation.streetName,
          streetNumber: contracterInformation.streetNumber,
          streetNumberBlock: contracterInformation.streetNumberBlock,
          postalCode: contracterInformation.postalCode,
          country: contracterInformation.country
        }
      }
    }
  }

  returnUpdatedOrder() {
    let updatedRequest = this.originalRequest;
    updatedRequest.products = this.products;
    updatedRequest.contactDetails = this.contactDetails;
    updatedRequest.contracterDetails = this.contracterDetails;
    return updatedRequest;
  }
}
