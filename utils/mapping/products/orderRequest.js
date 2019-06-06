import { access } from 'fs';
import { isEmpty } from 'lodash';

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
    const obj = {
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
    };
    if (!isEmpty(this.configurations)) {
      this.configurations.map(item => ({ id: item.id, name: item.name, value: item.value }));
      obj.configurations = this.configurations;
    }
    const list = this.accessories.filter((item) => item.quantity !== 0)
    if (!isEmpty(list)) {
      list.map(item => ({ id: item.id, quantity: item.quantity }));
      obj.accessories = list;
    }

    return obj;
  }
}
