import { access } from 'fs';
import { isEmpty } from 'lodash';

export default class OrderRequest {
  constructor(product, accessories, search, configurations) {
    console.log(product);
    console.log(accessories);
    console.log(search);
    console.log(configurations);
    this.id = product.id;
    this.quantity = 1;
    this.endDate = search.collectionDate;
    this.startDate = search.deliveryDate;
    this.startLocation = search.collectionLocation;
    this.endLocation = search.deliveryLocation;
    this.accessories = accessories;
    this.configurations = configurations;
    this.locations = locations;
  }

  returnOrder() {
    const obj = {
      id: this.id,
      quantity: this.quantity,
      period: {
        start: this.startDate,
        end: this.endDate,
      },
      location: {
        delivery: this.startLocation,
        collection: this.endLocation,
      },
    };
    if (!isEmpty(this.configurations)) {
      this.configurations.map(item => ({ id: item.id, name: item.name, value: item.value }));
      obj.configurations = this.configurations;
    }
    const list = this.accessories.filter(item => item.quantity !== 0);
    if (!isEmpty(list)) {
      list.map(item => ({ id: item.id, quantity: item.quantity }));
      obj.accessories = list;
    }
    return obj;
  }
}
