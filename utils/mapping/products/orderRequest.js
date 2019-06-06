import { access } from 'fs';

export default class OrderRequest {
  constructor(product, accessories, search, configurations) {
    this.id = product.id;
    this.quantity = 1;
    this.startDate = search.collectionDate;
    this.endDate = search.deliveryDate;
    this.startLocation = search.collectionLocation;
    this.endLocation = search.deliveryLocation;
    this.accessories = accessories;
    this.configurations = configurations;
  }

  returnOrder() {
    return {
      id: this.id,
      quantity: this.quantity,
      period: {
        start: this.startDate,
        end: this.startDate,
      },
      location: {
        collectionId: this.startLocation,
        dropOffId: this.endLocation,
      },
      configurations: this.configurations,
      accessoires: this.accessories,
    };
  }
}
