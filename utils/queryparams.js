export function NullCheckQueryParams(values) {
  const queryParameters = {};
  if (values.keyword !== '') {
    queryParameters.keyword = encodeURIComponent(values.keyword);
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
  console.log(values);
  if (values.keyword !== undefined) {
    queryParameters.push({ column: 'q[name_or_product_group_name_or_product_tags_name_cont]', value: encodeURIComponent(values.keyword) });
  }
  if (values.deliveryLocation !== null) {
    queryParameters.push({ column: 'deliveryLocation', value: values.deliveryLocation });
  }
  if (values.category !== undefined) {
    queryParameters.push({ column: 'q[product_group_id_eq]', value: values.category });
  }
  if (values.collectionLocation !== null) {
    queryParameters.push({ column: 'collectionLocation', value: values.collectionLocation });
  }
  if (values.deliveryDate !== null) {
    queryParameters.push({ column: 'deliveryDate', value: values.deliveryDate });
  }
  if (values.collectionDate !== null) {
    queryParameters.push({ column: 'collectionDate', value: values.collectionDate });
  }
  return queryParameters;
}

export function toQueryParameterString(queryParams) {
  let params = '';
  if (queryParams !== null && queryParams.length > 0) {
    queryParams.map((item, index) => {
      if (index === 0) {
        params = `${params}?${item.column}=${item.value}`;
      }
      if (index > 0 && index < queryParams.length) {
        params = `${params}&${item.column}=${item.value}`;
      }
    });
  }
  return params;
}
