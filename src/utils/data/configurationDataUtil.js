import { cloneDeep } from 'lodash';

export function transformConfigurationData(configurations) {
  const clonedConfigurations = cloneDeep(configurations);
  const configurationsData = configurations.values.map((item) => {
    const obj = {};

    const testobj = {};
    testobj.id = clonedConfigurations.id
    testobj.name = clonedConfigurations.name
    testobj.value = item.name

    obj.value = JSON.stringify(testobj);
    obj.label = item.name;
    return obj;
  });
  clonedConfigurations.values = configurationsData;
  return clonedConfigurations;
}
