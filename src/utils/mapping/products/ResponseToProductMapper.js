import Product from './Product';

export default class ResponseToProductMapper {

  constructor(){}

  mapResponseToProduct = (productResponse) => {
    return new Product(productResponse);
  }

  mapResponseToProducts(productsResponse) {
    const products = productsResponse.map((productResponse) => {
      return new Product(productResponse);
    });
    return products;
  }

}
