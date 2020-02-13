import { parse } from "dotenv";
import moment from "moment";

export default class CartUtils {

  constructor() { 
  }

  dayCount(cartItem) {
    const collectionDate = moment(cartItem.period.end).endOf("day");
    const deliveryDate = moment(cartItem.period.start).startOf("day");
    return collectionDate.diff(deliveryDate, "days");
  }

  getAccessoryTotal(days, accessory) {
    if(days > 0 && accessory.quantity && accessory.rates. length > 0){
      return days * accessory.quantity * parseFloat(accessory.rates[0].price);
    }
    return 0;
  }

  getAccessoriesTotal(days, accessories) {
    let accessoryTotal = 0;
    accessories.map( accessory => {
      accessoryTotal += this.getAccessoryTotal(days, accessory);
    });
    return accessoryTotal;
  }

  getProductTotal(days, quantity, product) {
    if(days > 0 && product.quantity > 0 && product.rates.length > 0){
      return days * quantity * parseFloat(product.rates[0].price);
    }
    return 0;
  }

  getCartItemTotal(cartItem) {
    let days = this.dayCount(cartItem);
    let total = 0;

    cartItem.products.map( product =>  {
      total += this.getProductTotal(days, product.quantity, product.details);
      total += this.getAccessoriesTotal(days, product.accessories);
    });

    return total.toFixed(2);
  }
}
