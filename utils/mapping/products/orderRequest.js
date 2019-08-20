import { isEmpty } from 'lodash';
import store from '../../../store';

export default class OrderRequest {
  constructor(item) {
    if(item) {
      this.id = item.selectedProduct.id,
      this.quantity = item.productQuantity,
      this.period = {
        start: item.deliveryDate,
        end: item.collectionDate,
      };
      this.location = {
        delivery: {
          id: item.deliveryLocation.value.id,
          name: item.deliveryLocation.value.name
        },
        collection: {
          id: item.collectionLocation.value.id,
          name: item.collectionLocation.value.name
        }
      };

      if (!isEmpty(item.productConfigurations)) {
        this.configurations.map(configuration => ({ id: configuration.id, name: configuration.name, value: configuration.value }));
        this.configurations = this.configurations;
      }

      const list = item.productOptionalAccessories.filter(accessory => accessory.quantity !== 0);
      if (!isEmpty(list)) {
        list.map(accessory => ({ id: accessory.id, quantity: accessory.quantity }));
        this.accessories = list;
      }
    }
  }

  returnOrderRequests() {
    const state = store.getState();
    let orderRequests = [];
    orderRequests = state.cartReducer.items.map(item => {
      const obj = {
        id: item.id,
        quantity: item.quantity,
        period: {
          start: item.period.start, //deliveryDate,
          end: item.period.end, //collectionDate,
        },
        location: {
          delivery: {
            id: item.location.start, //.value.id,
            name: item.location.start, //deliveryLocation.value.name
          },
          collection: {
            id: item.location.end, //collectionLocation.value.id,
            name: item.location.end, //collectionLocation.value.name
          }
        },
      };
      if (!isEmpty(item.productConfigurations)) {
        this.configurations.map(configuration => ({ id: configuration.id, name: configuration.name, value: configuration.value }));
        obj.configurations = this.configurations;
      }

      const list = item.accessories.filter(accessory => accessory.quantity !== 0);
      if (!isEmpty(list)) {
        list.map(accessory => ({ id: accessory.id, quantity: accessory.quantity }));
        obj.accessories = list;
      }
      return obj;
    });

    return orderRequests;
  }
}
