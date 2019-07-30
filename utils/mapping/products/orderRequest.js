import { access } from 'fs';
import { isEmpty } from 'lodash';
import store from '../../../store';

export default class OrderRequest {
  constructor() {}

  returnOrderRequests() {
    const state = store.getState();
    let orderRequests = [];
    orderRequests = state.cartReducer.items.map(item => {
      const obj = {
        id: item.selectedProduct.id,
        quantity: item.productQuantity,
        period: {
          start: item.deliveryDate,
          end: item.collectionDate,
        },
        location: {
          delivery: {
            id: item.deliveryLocation.value.id,
            name: item.deliveryLocation.value.name
          },
          collection: {
            id: item.collectionLocation.value.id,
            name: item.collectionLocation.value.name
          }
        },
      };
      if (!isEmpty(item.productConfigurations)) {
        this.configurations.map(configuration => ({ id: configuration.id, name: configuration.name, value: configuration.value }));
        obj.configurations = this.configurations;
      }
      const list = item.productOptionalAccessories.filter(accessory => accessory.quantity !== 0);
      if (!isEmpty(list)) {
        list.map(accessory => ({ id: accessory.id, quantity: accessory.quantity }));
        obj.accessories = list;
      }
      return obj;
    });

    return orderRequests;
  }
}
