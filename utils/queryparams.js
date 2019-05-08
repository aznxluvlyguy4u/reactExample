export function NullCheckQueryParams(values) {
  const queryParameters = [];
  if (values.keyword !== '') {
    queryParameters.push({ column: 'keyword', value: values.keyword });
  }
  if (values.deliveryLocation !== '') {
    queryParameters.push({ column: 'deliveryLocation', value: values.deliveryLocation.storeId });
  }
  if (values.collectionLocation !== '') {
    queryParameters.push({ column: 'collectionLocation', value: values.collectionLocation.storeId });
  }
  if (values.deliveryDate !== '') {
    queryParameters.push({ column: 'deliveryDate', value: values.deliveryDate });
  }
  if (values.collectionDate !== '') {
    queryParameters.push({ column: 'collectionDate', value: values.collectionDate });
  }
  return queryParameters;
}

export function NullCheckProps(values) {
  const queryParameters = [];
  if (values.keyword !== undefined) {
    queryParameters.push({ column: 'q[name_or_product_group_name_or_product_tags_name_cont]', value: values.keyword });
  }
  if (values.deliveryLocation !== undefined) {
    queryParameters.push({ column: 'deliveryLocation', value: values.deliveryLocation });
  }
  if (values.category !== undefined) {
    queryParameters.push({ column: 'q[product_group_id_eq]', value: values.category });
  }
  if (values.collectionLocation !== undefined) {
    queryParameters.push({ column: 'collectionLocation', value: values.collectionLocation });
  }
  if (values.deliveryDate !== undefined) {
    queryParameters.push({ column: 'deliveryDate', value: values.deliveryDate });
  }
  if (values.collectionDate !== undefined) {
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
