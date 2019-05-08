export default class ProductResponse {
  constructor(state) {
    this.id = state.id;
    this.name = state.name;
    this.public_icon_url = state.custom_fields.public_icon_url;
    this.day_rate = state.rental_rate.properties.day_price;
  }

  returnProduct() {
    return {
      id: this.id,
      name: this.name,
      images: {
        public_icon_url: this.public_icon_url,
      },
      rates: {
        day_rate: this.day_rate,
      },
    };
  }
}
