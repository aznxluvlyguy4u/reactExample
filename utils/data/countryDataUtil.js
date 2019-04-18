export function transformCountryData(countries){
  const countriesdata = Object.keys(countries).map(function(key, index) {
    const obj = {}
    obj['value'] = key;
    obj['label'] = countries[key].emoji+"  "+ countries[key].name
    obj['phone'] = countries[key].phone
    return obj
  });
  return countriesdata
}
