export default class SelectboxLocation {
  constructor(location) {
    if (location.cruisingArea) {
      this.id = location.id;
      this.label = `${location.cruisingArea} - ${location.name}`;
      this.name = location.name;
      this.value = {
        id: location.id,
        name: location.name,
      };
    } else {
      this.id = location.id;
      this.label = location.name;
      this.name = location.name;
      this.value = {
        id: location.id,
        name: location.name,
      };
    }
  }
}
