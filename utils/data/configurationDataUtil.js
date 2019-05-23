export function transformConfigurationData(configurations) {
  const configurationsData = configurations.map((item) => {
    const obj = {};
    obj.value = item.id;
    obj.label = item.name;
    return obj;
  });
  return configurationsData;
}
