export function updateSearch(search) {
  console.log(search);
  delete search.collectionDate;
  return { type: 'UPDATE_SEARCH', search };
}
