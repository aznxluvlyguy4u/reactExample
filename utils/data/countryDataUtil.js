export function transformCountryData(countries){
  const countriesdata = Object.keys(countries).map(function(key, index) {
    const obj = {}
    obj['value'] = JSON.stringify({"name": countries[key].name, "alpha2Code": key, "callingCode": countries[key].phone});
    obj['label'] = countries[key].emoji+"  "+ countries[key].name
    obj['phone'] = countries[key].phone
    return obj
  });
  return countriesdata
}
