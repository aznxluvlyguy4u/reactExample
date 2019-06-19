import { access } from 'fs';
import { isEmpty } from 'lodash';

export default class OrderRequest {
  constructor(product, accessories, search, configurations, locations) {
    console.log(product);
    console.log(accessories);
    console.log(search);
    console.log(configurations);
    console.log(locations);
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
    if (typeof this.startLocation === 'string') {
      const object = this.locations.find(item => item.id === Number(this.startLocation));
      obj.location.delivery = { id: object.id, name: object.name };
    }
    if (typeof this.endLocation === 'string') {
      const object = this.locations.find(item => item.id === Number(this.endLocation));
      obj.location.collection = { id: object.id, name: object.name };
    }

    return obj;
  }
}
