import { merge } from 'lodash';

export function updateSearch(search) {
  return { type: 'UPDATE_SEARCH', search };
}

export function updateSearchObject(search, updatedsearch) {
  const newobj = merge(search, updatedsearch);
  return { type: 'UPDATE_SEARCH', search };
}
