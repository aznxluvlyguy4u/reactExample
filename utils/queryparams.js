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

export function NullCheckQueryParams(values) {
  const queryParameters = {};
  if (values.keyword !== '') {
    queryParameters.keyword = values.keyword ? encodeURIComponent(values.keyword) : undefined;
  }
  if (values.deliveryLocation !== '') {
    queryParameters.deliveryLocation = JSON.decode(values.deliveryLocation.value).id;
  }
  if (values.collectionLocation !== '') {
    queryParameters.collectionLocation = JSON.decode(values.collectionLocation.value).id;
  }
  if (values.deliveryDate !== '') {
    queryParameters.deliveryDate = values.deliveryDate;
  }
  if (values.collectionDate !== '') {
    queryParameters.collectionDate = values.collectionDate;
  }
  return queryParameters;
}

export function NullCheckProps(values) {
  const queryParameters = [];
  if (values.keyword !== '') {
    queryParameters.push({ column: 'q[product_tags_name_cont]', value: encodeURIComponent(values.keyword) });
  }
  if (values.deliveryLocation !== null) {
    queryParameters.push({ column: 'delivery_location_id', value: JSON.parse(values.deliveryLocation) });
  }
  if (values.category !== undefined) {
    queryParameters.push({ column: 'q[product_group_id_eq]', value: values.category });
  }
  if (values.collectionLocation !== null) {
    queryParameters.push({ column: 'collection_location_id', value: JSON.parse(values.collectionLocation).id });
  }
  if (values.collectionDate !== null) {
    queryParameters.push({ column: 'starts_at', value: values.collectionDate });
  }
  if (values.deliveryDate !== null) {
    queryParameters.push({ column: 'ends_at', value: values.deliveryDate });
  }
  return queryParameters;
}

export function CreateQueryParams(state) {
  const queryParameters = {};
  if (state.keyword !== '' && state.keyword !== undefined && state.keyword !== null) {
    queryParameters.keyword = state.keyword;
  }
  if (state.deliveryLocation !== '' && state.deliveryLocation !== undefined && state.deliveryLocation !== null) {
    queryParameters.deliveryLocation = JSON.parse(state.deliveryLocation).id;
  }
  if (state.collectionLocation !== '' && state.collectionLocation !== undefined && state.collectionLocation !== null) {
    queryParameters.collectionLocation = JSON.parse(state.collectionLocation).id;
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
