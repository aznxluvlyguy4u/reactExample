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
    queryParameters.deliveryLocation = values.deliveryLocation.storeId;
  }
  if (values.collectionLocation !== '') {
    queryParameters.collectionLocation = values.collectionLocation.storeId;
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
    queryParameters.push({ column: 'store_id', value: values.deliveryLocation });
  }
  if (values.category !== undefined) {
    queryParameters.push({ column: 'q[product_group_id_eq]', value: values.category });
  }
  // if (values.collectionLocation !== null) {
  //   queryParameters.push({ column: 'collectionLocation', value: values.collectionLocation });
  // }
  if (values.deliveryDate !== null) {
    queryParameters.push({ column: 'starts_at', value: values.deliveryDate });
  }
  if (values.collectionDate !== null) {
    queryParameters.push({ column: 'ends_at', value: values.collectionDate });
  }
  queryParameters.push({ column: 'filtermode[]', value: 'rental' });
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
