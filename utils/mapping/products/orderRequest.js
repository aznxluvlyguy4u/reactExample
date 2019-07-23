import { access } from 'fs';
import { isEmpty } from 'lodash';
import store from '../../../store';

export default class OrderRequest {
  constructor(product, accessories, search, configurations) {
  }

  returnOrderRequest() {
    const state = store.getState();

    const obj = {
      id: state.localSearchReducer.selectedProduct.id,
      quantity: state.localSearchReducer.selectedProduct.productQuantity, // this.quantity,
      period: {
        start: state.localSearchReducer.search.deliveryDate, //this.startDate,
        end: state.localSearchReducer.search.collectionDate, // this.endDate,
      },
      location: {
        delivery: state.localSearchReducer.search.deliveryLocation, //this.startLocation,
        collection: state.localSearchReducer.search.collectionLocation , //this.endLocation,
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
