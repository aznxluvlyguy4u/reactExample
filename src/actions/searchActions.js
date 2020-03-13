import { merge } from 'lodash';

export function updateSearch(search) {
  return { type: 'UPDATE_SEARCH', search };
}

export function updateSearchBooking(booking) {
  return { type: 'UPDATE_SEARCH_BOOKING', payload: booking };
}

export function updateSearchDeliveryLocation(deliveryLocation) {
  return { type: 'UPDATE_SEARCH_DELIVERY_LOCATION', payload: deliveryLocation };
}

export function updateSearchCollectionLocation(collectionLocation) {
  return { type: 'UPDATE_SEARCH_COLLECTION_LOCATION', payload: collectionLocation };
}

export function updateSearchKeyword(keyword) {
  return { type: 'UPDATE_SEARCH_KEYWORD', payload: keyword };
}

export function updateSearchDeliveryDate(deliveryDate) {
  return { type: 'UPDATE_SEARCH_DELIVERY_DATE', payload: deliveryDate };
}

export function updateSearchCollectionDate(collectionDate) {
  return { type: 'UPDATE_SEARCH_COLLECTION_DATE', payload: collectionDate };
}

export function updateSearchObject(updatedsearch) {
  return { type: 'UPDATE_SEARCH', updatedsearch };
}
