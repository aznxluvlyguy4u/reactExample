import store from '../store';


export function NullCheckFrontendQueryParam(values) {
  const queryParameters = {};
  if (values.keyword !== null) {
    queryParameters.keyword = values.keyword ? encodeURIComponent(values.keyword) : undefined;
  }
  if (values.deliveryLocation !== null) {
    queryParameters.deliveryLocation = values.deliveryLocation.storeId;
  }
  if (values.collectionLocation !== null) {
    queryParameters.collectionLocation = values.collectionLocation.storeId;
  }
  if (values.deliveryDate !== null) {
    queryParameters.deliveryDate = values.deliveryDate;
  }
  if (values.collectionDate !== null) {
    queryParameters.collectionDate = values.collectionDate;
  }
  return queryParameters;
}

export function generateSearchQueryParameterString() {
  const state = store.getState();
  const queryParameters = {};
  if (state.searchReducer.search.keyword && state.searchReducer.search.keyword !== '' && state.searchReducer.search.keyword !== null) {
    queryParameters.keyword = state.searchReducer.search.keyword ? encodeURIComponent(state.searchReducer.search.keyword) : undefined; //values.keyword ? encodeURIComponent(values.keyword) : undefined;
  }
  if (state.searchReducer.search.deliveryLocation && state.searchReducer.search.deliveryLocation !== null && state.searchReducer.search.deliveryLocation !== '') {
    queryParameters.deliveryLocation = state.searchReducer.search.deliveryLocation.value.id; //values.deliveryLocation.value.id;
  }
  if (state.searchReducer.search.collectionLocation && state.searchReducer.search.collectionLocation !== null && state.searchReducer.search.collectionLocation !== '') {
    queryParameters.collectionLocation = state.searchReducer.search.collectionLocation.value.id; //values.collectionLocation.value.id;
  }
  if (state.searchReducer.search.deliveryDate && state.searchReducer.search.deliveryDate !== null && state.searchReducer.search.deliveryDate !== '') {
    queryParameters.deliveryDate = state.searchReducer.search.deliveryDate; //values.deliveryDate;
  }
  if (state.searchReducer.search.collectionDate && state.searchReducer.search.collectionDate !== null && state.searchReducer.search.collectionDate !== '') {
    queryParameters.collectionDate = state.searchReducer.search.collectionDate; //values.collectionDate;
  }
  return queryParameters;
}

export function NullCheckProps(values) {
  const queryParameters = [];
  if (values.keyword !== '') {
    queryParameters.push({ column: 'q[product_tags_name_cont]', value: encodeURIComponent(values.keyword) });
  }
  if (values.deliveryLocation !== null) {
    queryParameters.push({ column: 'delivery_location_id', value: values.deliveryLocation });
  }
  if (values.category !== undefined) {
    queryParameters.push({ column: 'q[product_group_id_eq]', value: values.category });
  }
  if (values.collectionLocation !== null) {
    queryParameters.push({ column: 'collection_location_id', value: values.collectionLocation });
  }
  if (values.collectionDate !== null) {
    queryParameters.push({ column: 'ends_at', value: values.collectionDate });
  }
  if (values.deliveryDate !== null) {
    queryParameters.push({ column: 'starts_at', value: values.deliveryDate });
  }
  return queryParameters;
}

export function CreateQueryParams(state) {

  const queryParameters = {};
  if (state.keyword !== '' && state.keyword !== undefined && state.keyword !== null) {
    queryParameters.keyword = state.keyword;
  }
  if (state.deliveryLocation !== '' && state.deliveryLocation !== undefined && state.deliveryLocation !== null) {
    queryParameters.deliveryLocation = state.deliveryLocation.id;
  }
  if (state.collectionLocation !== '' && state.collectionLocation !== undefined && state.collectionLocation !== null) {
    queryParameters.collectionLocation = state.collectionLocation.id;
  }
  if (state.deliveryDate !== '' && state.deliveryDate !== undefined && state.deliveryDate !== null) {
    queryParameters.deliveryDate = state.deliveryDate;
  }
  if (state.collectionDate !== '' && state.collectionDate !== undefined && state.collectionDate !== null) {
    queryParameters.collectionDate = state.collectionDate;
  }
  return queryParameters;
}

export function toQueryParameterString(queryParams) {
  let params = '';
  if (queryParams !== null && queryParams.length > 0) {
    queryParams.map((item, index) => {
      if (index === 0) {
        params = `${params}&${item.column}=${item.value}`;
      }
      if (index > 0 && index < queryParams.length) {
        params = `${params}&${item.column}=${item.value}`;
      }
    });
  }
  return params;
}
