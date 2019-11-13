export default class SelectboxLocation {
  constructor(location) {
    this.id = location.id;
    this.label = location.name;
    this.name = location.name;
    this.value = {
      id: location.id,
      name: location.name
    }
  }
}
