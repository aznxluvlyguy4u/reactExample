import React, { Component } from "react";
import Modal from "react-modal";
import styles from "./checkoutBookingConfigure.style";
import LocalStorageUtil from "../../../../utils/localStorageUtil";
import CheckoutBookingConfigureGridRow from "./checkoutBookingConfigureGridRow";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";

const cartUtils = new CartUtils();
class CheckoutBookingConfigure extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      cart: props.cart,
      cartItemIndex: props.configureIndex,
      cartItem: props.cart[props.configureIndex]
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeFromCartAndClose = this.removeFromCartAndClose.bind(this);
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

  closeModal() {
    this.setState({ modalIsOpen: false });
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
              <div key={`${this.state.cartItem.id}_${product.id}`}>
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
                    quantity: product.quantity,
                    period: this.state.cartItem.period,
                    item: cartUtils.getProductDetailsAndAvailability(
                      this.props.productBookingMap,
                      this.props.cart[this.props.configureIndex].id,
                      product.id
                    ),
                    itemDetails: cartUtils.getProductDetailsAndAvailability(
                      this.props.productBookingMap,
                      this.props.cart[this.props.configureIndex].id,
                      product.id
                    )
                  }}
                  counterUpdate={value =>
                    this.props.updateProductCounter(
                      this.state.cartItem.id,
                      product.id,
                      value
                    )
                  }
                  openModalAndSetItem={() =>
                    this.openModalAndSetItem({ pIndex })
                  }
                />
                <div className="divider my-3" />
                {product.accessories &&
                  product.accessories.map((accessory, aIndex) => (
                    <CheckoutBookingConfigureGridRow
                      key={`${this.state.cartItem.id}_${product.id}+${accessory.id}`}
                      rowItem={{
                        index: aIndex,
                        quantity: accessory.quantity,
                        period: this.state.cartItem.period,
                        item: accessory,
                        itemDetails:
                          cartUtils
                            .getProductDetailsAndAvailability(
                              this.props.productBookingMap,
                              this.props.cart[this.props.configureIndex].id,
                              product.id
                            )
                            .accessories.filter(x => x.id === accessory.id)
                            .length > 0
                            ? cartUtils
                                .getProductDetailsAndAvailability(
                                  this.props.productBookingMap,
                                  this.props.cart[this.props.configureIndex].id,
                                  product.id
                                )
                                .accessories.filter(
                                  x => x.id === accessory.id
                                )[0]
                            : undefined
                      }}
                      counterUpdate={value =>
                        this.props.updateAccessoryCounter(
                          this.state.cartItem.id,
                          product.id,
                          accessory.id,
                          value
                        )
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
