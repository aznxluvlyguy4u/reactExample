import { merge } from 'lodash';

export function updateSearch(search) {
  console.log(search);
  return { type: 'UPDATE_SEARCH', search };
}

export function updateSearchObject(search, updatedsearch) {
  const newobj = merge(search, updatedsearch);
  console.log(newobj);
  console.log(search);
  return { type: 'UPDATE_SEARCH', search };
}
