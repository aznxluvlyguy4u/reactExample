import { access } from 'fs';
import { isEmpty } from 'lodash';
import store from '../../../store';

export default class OrderRequest {
  constructor() {}

  returnOrderRequest() {
    const state = store.getState();

    const obj = {
      id: state.localSearchReducer.selectedProduct.id,
      quantity: state.localSearchReducer.productQuantity,
      period: {
        start: state.localSearchReducer.search.deliveryDate,
        end: state.localSearchReducer.search.collectionDate,
      },
      location: {
        delivery: {
          id: state.localSearchReducer.search.deliveryLocation.value.id,
          name: state.localSearchReducer.search.deliveryLocation.value.name
        },
        collection: {
          id: state.localSearchReducer.search.collectionLocation.value.id,
          name: state.localSearchReducer.search.collectionLocation.value.name
        }
      },
    };
    if (!isEmpty(state.localSearchReducer.productConfigurations)) {
      this.configurations.map(item => ({ id: item.id, name: item.name, value: item.value }));
      obj.configurations = this.configurations;
    }
    const list = state.localSearchReducer.productOptionalAccessories.filter(item => item.quantity !== 0);
    if (!isEmpty(list)) {
      list.map(item => ({ id: item.id, quantity: item.quantity }));
      obj.accessories = list;
    }
    return obj;
  }
}
