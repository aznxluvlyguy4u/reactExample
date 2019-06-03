import { access } from 'fs';

export default class OrderRequest {
  constructor(product, state, accessories) {
    console.log(product);
    console.log(state);
    console.log(accessories);
    this.id = product.id;
    this.quantity = 1;
    this.startDate = state.startDate;
    this.endDate = state.endDate;
    this.startLocation = state.startLocation;
    this.endLocation = state.endLocation;
    this.accessories = accessories;
  }

  returnAccesoires(accessories) {
    const arr = [];
    accessories.map((item) => {
      const obj = {};
      obj.id = item.data.id;
      obj.quantity = item.quanitity;
      arr.push(obj);
    });
    console.log(arr);
    return arr;
  //  const arr = [
  //     {
  //       id: 247,
  //       quantity: 3,
  //       configuration: {
  //         color: 'Pink',
  //         size: 'L',
  //       },
  //       quantityAvailable: 0,
  //       available: false,
  //     },
  // ];
  }

  returnOrder() {
    return {
      id: this.id,
      quantity: this.quantity,
      period: {
        start: this.startDate,
        end: this.startDate,
      },
      location: {
        collectionId: this.startLocation.value,
        dropOffId: this.endLocation.value,
      },
      configuration: {
        color: 'Pink',
        size: 'L',
      },
      accessoires: this.returnAccesoires(this.accessories),
    };
  }
}
