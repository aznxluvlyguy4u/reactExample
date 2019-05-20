export function transformCountryData(countries) {
  const countriesdata = Object.keys(countries).map((key, index) => {
    const obj = {};
    obj.value = JSON.stringify({ name: countries[key].name, alpha2Code: key, callingCode: countries[key].phone });
    obj.label = `${countries[key].emoji}  ${countries[key].name}`;
    obj.phone = countries[key].phone;
    return obj;
  });
  return countriesdata;
}

export function transformLocationData(locations) {
  const locationsdata = Object.keys(locations).map((key, index) => {
    const obj = {};
    obj.value = locations[key].id;
    obj.label = `${locations[key].name}`;
    return obj;
  });
  return locationsdata;
}
