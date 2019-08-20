import store from '../../../store';
import OrderRequest from './orderRequest';

export default class Order {
  constructor() { }

  returnOrder() {
    const state = store.getState();

    const order = {
      selectedProduct: state.localSearchReducer.selectedProduct,
      productQuantity: state.localSearchReducer.productQuantity,
      deliveryDate: state.localSearchReducer.search.deliveryDate,
      collectionDate: state.localSearchReducer.search.collectionDate,
      deliveryLocation: state.localSearchReducer.search.deliveryLocation,
      collectionLocation: state.localSearchReducer.search.collectionLocation,
      productOptionalAccessories: state.localSearchReducer.productOptionalAccessories,
      productConfigurations: state.localSearchReducer.productConfigurations,
    }
    order.orderRequest = new OrderRequest(order);
    return order;
  }
}
