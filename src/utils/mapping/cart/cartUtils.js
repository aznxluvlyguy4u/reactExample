import moment from "moment";

export default class CartUtils {

  constructor() {}

  getProductDetailsAndAvailability(availability, cartItemId, productId) {
    return availability
      .find(item => item.id === cartItemId)
      .availability.find(product => product.id === productId);
  }

  getProductImage(availability, cartItemId, productId) {
    return availability
      .find(item => item.id === cartItemId)
      .availability.find(product => product.id === productId).images[0].url;
  }

  dayCount(cartItem) {
    const collectionDate = moment(cartItem.period.end).endOf("day");
    const deliveryDate = moment(cartItem.period.start).startOf("day");
    return collectionDate.diff(deliveryDate, "days");
  }

  getAccessoryTotal(days, accessory) {
    if (days > 0 && accessory.quantity && accessory.rates.length > 0) {
      return days * accessory.quantity * parseFloat(accessory.rates[0].price);
    }
    return 0;
  }

  getAccessoriesTotal(days, accessories) {
    let accessoryTotal = 0;
    accessories.map(accessory => {
      accessoryTotal += this.getAccessoryTotal(days, accessory);
    });
    return accessoryTotal;
  }

  getProductTotal(days, quantity, product) {
    if (days > 0 && quantity > 0 && product.rates.length > 0) {
      return days * quantity * parseFloat(product.rates[0].price);
    }
    return 0;
  }

  getItemTotal(period, quantity, item) {
    const days = this.dayCount({ period });
    if (days > 0 && quantity > 0 && item.rates.length > 0) {
      return (days * quantity * parseFloat(item.rates[0].price)).toFixed(2);
    }
    return (0).toFixed(2);
  }

  getCartItemTotal(cartItem, availability) {
    const days = this.dayCount(cartItem);
    let total = 0;

    cartItem.products.map(product => {
      total += this.getProductTotal(
        days,
        product.quantity,
        availability.availability.find(p => p.id === product.id)
      );
      total += this.getAccessoriesTotal(
        days,
        availability.availability.find(p => p.id === product.id).accessories
      );
    });

    return total.toFixed(2);
  }

  getCartItemPercentage(cartItem, availability, percetage) {
    return (this.getCartItemTotal(cartItem, availability) * (percetage / 100)).toFixed(2);
  }

  getCartItemTotalWithFee(cartItem, availability, percetage) {
    const total =
      parseFloat(this.getCartItemTotal(cartItem, availability)) +
      parseFloat(this.getCartItemTotal(cartItem, availability) * (percetage / 100));
    return total.toFixed(2);
  }

  getItemCount(cartItem) {
    const products = cartItem.products.length;
    let accessories = 0;
    cartItem.products.map(product => {
      accessories += product.accessories.length;
    });
    return products + accessories;
  }

  cartItemsAllAvailable(cartItem, availability) {
    return cartItem.products.every(product => {
      const productAvailability = this.getProductDetailsAndAvailability(availability, cartItem.id, product.id);
      if (!product.accessories || product.accessories.length === 0) {
        return product.quantity <= productAvailability.quantityAvailable;
      } else {
        const validAccessories = product.accessories.every(accessory => {
          const accAvailable = productAvailability.accessories.find(availableAccessory => availableAccessory.id === accessory.id);
          return accAvailable && accessory.quantity <= accAvailable.quantityAvailable;
        });
        return (
          product.quantity <= productAvailability.quantityAvailable &&
          validAccessories
        );
      }
    });
  }
}
