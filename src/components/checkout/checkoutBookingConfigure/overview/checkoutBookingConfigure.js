import React, { Component } from "react";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";
import Modal from "react-modal";
import styles from "./checkoutBookingConfigure.style";
import LocalStorageUtil from "../../../../utils/localStorageUtil";
import CheckoutBookingConfigureGridRow from "./checkoutBookingConfigureGridRow";

class CheckoutBookingConfigure extends Component {
  constructor(props) {
    super(props);

    let cart = props.cart;
    let ct = cart;
    let cartItem;

    if (cart) {
      ct = cart.map((cartItem, index) => {
        cartItem.products.map((product, pIndex) => {
          product.details = props.products.filter(x => x.id == product.id)[0];
          return product;
        });
        return cartItem;
      });
      cartItem = cart[props.configureIndex];
    }

    this.state = {
      modalIsOpen: false,
      cart: ct,
      cartUtils: new CartUtils(),
      cartItemIndex: props.configureIndex,
      cartItem
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeFromCartAndClose = this.removeFromCartAndClose.bind(this);
    console.log(this.state.cartItem);
  }

  removeFromCartAndClose() {
    let cart = this.state.cart;
    if (this.state.cartIndex.aIndex) {
      cart[this.state.cartItemIndex].products[
        this.state.cartIndex.pIndex
      ].accessories.splice(this.state.cartIndex.aIndex, 1);
    } else {
      cart[this.state.cartItemIndex].products.splice(
        this.state.cartIndex.pIndex,
        1
      );
    }
    LocalStorageUtil.setCart(cart);
    this.setState({ cart: cart, modalIsOpen: false, cartIndex: undefined });
  }

  configureAll() {
    this.props.setConfigureAll("configurAll");
  }

  configure(cartItemIndex) {
    this.props.setConfigureItem(cartItemIndex);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  openModalAndSetItem(index) {
    this.setState({ modalIsOpen: true, cartIndex: index });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  updateProductCounter(pIndex, value) {
    console.log(pIndex, value);
  }

  updateAccessoryCounter(pIndex, aIndex, value) {
    console.log(pIndex, aIndex, value);
  }

  revertToCartBookingsOverview() {
    this.props.revertToCartBookingsOverview();
  }

  captureCheckoutRequirements() {
    this.props.captureCheckoutRequirements();
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="paragraph">
          {this.state.cartItem &&
            this.state.cartItem.products.map((product, pIndex) => (
              <div>
                <div className="row my-2">
                  <div className="col-6">Product</div>
                  <div className="col-2">Qty</div>
                  <div className="col-2">Price</div>
                  <div className="col-2">Availability</div>
                </div>

                <div className="divider my-3"></div>

                <CheckoutBookingConfigureGridRow
                  rowItem={{
                    index: pIndex,
                    images: product.details.images,
                    rates: product.details.rates,
                    quantity: product.quantity,
                    name: product.details.name,
                    period: this.state.cartItem.period,
                    stock: product.details
                  }}
                  counterUpdate={value =>
                    this.updateProductCounter(pIndex, value)
                  }
                  openModalAndSetItem={() =>
                    this.openModalAndSetItem({ pIndex })
                  }
                />
                <div className="divider my-3"></div>
                {product.accessories &&
                  product.accessories.map((accessory, aIndex) => (
                    <CheckoutBookingConfigureGridRow
                      rowItem={{
                        index: aIndex,
                        images: accessory.images,
                        rates: accessory.rates,
                        quantity: accessory.quantity,
                        name: accessory.name,
                        period: this.state.cartItem.period,
                        stock:
                          product.details.accessories.filter(
                            x => x.id === accessory.id
                          ).length > 0
                            ? product.details.accessories.filter(
                                x => x.id === accessory.id
                              )[0]
                            : undefined
                      }}
                      counterUpdate={value =>
                        this.updateAccessoryCounter(pIndex, aIndex, value)
                      }
                      openModalAndSetItem={() =>
                        this.openModalAndSetItem({ pIndex, aIndex })
                      }
                    />
                  ))}
              </div>
            ))}
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={styles}
            portalClassName="checkout-overview-modal"
          >
            <span className="close" onClick={this.closeModal}>
              X
            </span>
            <div className="content">
              <h1>Remove Item</h1>
              <p>Are you sure you want to remove this item from your cart?</p>
              <button
                onClick={this.removeFromCartAndClose.bind(this)}
                className="grey-button-outline"
              >
                Yes! Please remove this booking.
              </button>
              <br />
              <button
                onClick={this.closeModal}
                className="yellow-outline-button"
              >
                Keep Booking
              </button>
            </div>
          </Modal>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigure;
