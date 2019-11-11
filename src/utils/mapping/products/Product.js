export default class Product {

  constructor(productResponse) {
    this.id = productResponse.id;
    this.name = productResponse.name;
    this.description = productResponse.description;
    this.fullImageUrl = productResponse.images[0].fullImageUrl;
    this.thumbnailUrl = productResponse.images[0].thumbnailUrl;
    this.available = this.isAvailable(productResponse);
    this.fromPrice = productResponse.rates[0].price;
  }

  isAvailable = (productResponse) => {
    return parseFloat(productResponse.rates[0].quantityAvailable) > 0.0;
  }
}


