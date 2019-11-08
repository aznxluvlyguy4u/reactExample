export default class ProductResponse {
  constructor(state) {
    this.id = state.id;
    this.name = state.name;
    this.description = state.description;
    this.fullImageUrl = state.images[0].fullImageUrl;
    this.thumbnailUrl = state.images[0].thumbnailUrl;
    this.public_icon_url = state.images[0].fullImageUrl;
    this.day_rate = state.rates[0].price;
    this.available = parseFloat(state.rates[0].quantityAvailable) > 0.0;
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
      available: this.available,
      thumbnailUrl: this.thumbnailUrl,
      fullImageUrl: this.fullImageUrl
    };
  }
}
