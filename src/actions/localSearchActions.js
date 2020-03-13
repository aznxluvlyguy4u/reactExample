import { merge } from 'lodash';

export function setCurrentStep(step) {
  return { type: 'SET_CURRENT_STEP', payload: step };
}

export function setTotalSteps(totalSteps) {
  return { type: 'SET_TOTAL_STEPS', payload: totalSteps };
}

export function setSelectedProduct(product) {
  return { type: 'SET_SELECTED_PRODUCT', payload: product };
}

export function setProductAccessories(productAccessories) {
  return { type: 'SET_PRODUCT_ACCESSORIES', payload: productAccessories };
}

export function setProductMandatoryAccessories(productMandatoryAccessories) {
  return { type: 'SET_PRODUCT_MANDATORY_ACCESSORIES', payload: productMandatoryAccessories };
}

export function setProductOptionalAccessories(productOptionalAccessories) {
  return { type: 'SET_PRODUCT_OPTIONAL_ACCESSORIES', payload: productOptionalAccessories };
}

export function setProductConfigurations(productConfigurations) {
  return { type: 'SET_PRODUCT_CONFIGURATIONS', payload: productConfigurations };
}

export function updateLocalSearch(search) {
  return { type: 'UPDATE_LOCAL_SEARCH', search };
}

export function updateLocalSearchKeyword(keyword) {
  return { type: 'UPDATE_LOCAL_SEARCH_KEYWORD', payload: keyword };
}

export function updateLocalSearchDeliveryLocation(deliveryLocation) {
  return { type: 'UPDATE_LOCAL_SEARCH_DELIVERY_LOCATION', payload: deliveryLocation };
}

export function updateLocalSearchCollectionLocation(collectionLocation) {
  return { type: 'UPDATE_LOCAL_SEARCH_COLLECTION_LOCATION', payload: collectionLocation };
}

export function updateLocalSearchDeliveryDate(deliveryDate) {
  return { type: 'UPDATE_LOCAL_SEARCH_DELIVERY_DATE', payload: deliveryDate };
}

export function updateLocalSearchCollectionDate(collectionDate) {
  return { type: 'UPDATE_LOCAL_SEARCH_COLLECTION_DATE', payload: collectionDate };
}

export function updateLocalSearchBooking(booking) {
  return { type: 'UPDATE_LOCAL_SEARCH_BOOKING', payload: booking };
}

export function updateLocalSearchProductQuantity(quantity) {
  return { type: 'UPDATE_LOCAL_SEARCH_PRODUCT_QUANTITY', payload: quantity };
}

export function updateAccessoryQuantityById({id, quantity}) {
  return { type: 'UPDATE_ACCESSORY_QUANTITY_BY_ID', payload: {id: id, quantity: quantity} };
}


export function resetLocalSearch() {
  return { type: 'RESET_LOCAL_SEARCH'};
}
