import moment from "moment";

export default class CartUtils {
  constructor() {}

  getProductDetailsAndAvailability(availability, cartItemId, product) {
    const available = availability
      ? availability.find(item => item.id === cartItemId)
      : undefined;
    if (available) {
      return availability
      .find(item => item.id === cartItemId)
      .availability.find(p => p.id === product.id);
    }else{
      return product;
    }
  }

  getProductImage(availability, cartItemId, product) {
    const available = availability
      ? availability.find(item => item.id === cartItemId)
      : undefined;

    if (available) {
      return available.availability.find(p => p.id === product.id).images[0]
        .url;
    } else {
      return product.images && product.images.length > 0 ? product.images[0].url : "";
    }
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

  getProductTotal(days, quantity, rates) {
    if (days > 0 && quantity > 0 && rates.length > 0) {
      return days * quantity * parseFloat(rates[0].price);
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

  getCartItemTransportCosts(availability) {
    let total = 0;

    if (availability.rootAvailability) {
      return parseFloat(availability.rootAvailability.totalTransportCosts).toFixed(2);
    }

    if (!availability) return total.toFixed(2);
    if (!availability.availability) return total.toFixed(2);
    if (availability.availability.length === 0) return total.toFixed(2);

    availability.availability.map(av => {
      total += parseFloat(av.totalTransportCosts)
    });

    return total.toFixed(2);
  }

  getCartItemRentalFee(availability) {
    let total = 0;

    if (availability.rootAvailability) {
      return parseFloat(availability.rootAvailability.totalPrice).toFixed(2);
    }

    if (!availability) return total.toFixed(2);
    if (!availability.availability) return total.toFixed(2);
    if (availability.availability.length === 0) return total.toFixed(2);

    availability.availability.map(av => {
      total += parseFloat(av.totalPrice)
    });

    return total.toFixed(2);
  }

  getCartItemTotal(cartItem, availability) {
    let total = 0;

    if (availability.rootAvailability) {
      return parseFloat(availability.rootAvailability.grandTotalPrice).toFixed(2);
    }

    if (!availability) return total.toFixed(2);
    if (!availability.availability) return total.toFixed(2);
    if (availability.availability.length === 0) return total.toFixed(2);

    availability.availability.map(av => {
      total += parseFloat(av.totalPrice) + parseFloat(av.totalTransportCosts)
    });

    return total.toFixed(2);
  }

  getCartItemPercentage(cartItem, availability, percetage) {
    return (
      this.getCartItemTotal(cartItem, availability) *
      (percetage / 100)
    ).toFixed(2);
  }

  getCartItemTotalWithFee(cartItem, availability, percetage) {
    const total =
      parseFloat(this.getCartItemTotal(cartItem, availability)) +
      parseFloat(
        this.getCartItemTotal(cartItem, availability) * (percetage / 100)
      );
    return total.toFixed(2);
  }

  getItemCount(cartItem) {
    //const products = cartItem.products.length;
    let count = 0;
    cartItem.products.map(product => {
      count += product.quantity;
      product.accessories.forEach(acc => {
        count += acc.quantity;
      })
      //accessories += product.accessories.length;
    });
    //return products + accessories;
    return count;
  }

  cartItemsAllAvailable(cartItem, availability) {
    return cartItem.products.every(product => {
      const productAvailability = this.getProductDetailsAndAvailability(
        availability,
        cartItem.id,
        product
      );
      if (!product.accessories || product.accessories.length === 0) {
        return product.quantity <= productAvailability.quantityAvailable;
      } else {
        const validAccessories = product.accessories.every(accessory => {
          const accAvailable = productAvailability.accessories.find(
            availableAccessory => availableAccessory.id === accessory.id
          );
          return (
            accAvailable && accessory.quantity <= accAvailable.quantityAvailable
          );
        });
        return (
          product.quantity <= productAvailability.quantityAvailable &&
          validAccessories
        );
      }
    });
  }
}
