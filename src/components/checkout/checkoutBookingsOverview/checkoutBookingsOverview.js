import React, { Component } from "react";
import moment from "moment";
import CartUtils from "../../../utils/mapping/cart/cartUtils";
import Modal from "react-modal";
import styles from "./checkout-overview-modal.style";
import LocalStorageUtil from "../../../utils/localStorageUtil";

class CheckoutBookingsOverview extends Component {
  constructor(props) {
    super(props);

    let cart = props.cart;
    let ct = cart;

    if (cart) {
      ct = cart.map((cartItem, index) => {
        cartItem.products.map((product, pIndex) => {
          product.details = props.products.filter(x => x.id == product.id)[0];
          return product;
        });
        return cartItem;
      });
    }

    this.state = {
      modalIsOpen: false,
      cart: ct,
      cartUtils: new CartUtils(),
      cartIndex: undefined
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeFromCartAndClose = this.removeFromCartAndClose.bind(this);
  }

  removeFromCartAndClose() {
    let cart = this.state.cart;
    cart.splice(this.state.cartIndex, 1);
    this.props.updateCart(cart);
    LocalStorageUtil.setCart(cart);
    this.setState({ cart: cart, modalIsOpen: false, cartIndex: undefined });
  }

  configureAll() {
    this.props.setConfigureAll();
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

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout checkout-overview">
          <div className="checkout-wrapper">
            <h1 className="px-0">
              Bookings
              <button
                onClick={() => this.configureAll()}
                className="yellow-button-outline"
              >
                Configure All
              </button>
            </h1>
            <div className="container">
              {this.state.cart.map((cartItem, index) => (
                <div
                  key={cartItem.id}
                  className="row mb-2 equal-height-columns bottom-bordered"
                >
                  <div className="col-1 align-self-center">
                    <a onClick={() => this.openModalAndSetItem(index)}>
                      <img src="static/images/delete.png" />
                    </a>
                  </div>
                  <div className="col-3">
                    <h3>
                      {cartItem.location.delivery.name}{" "}
                      {cartItem.location.collection.name}
                    </h3>
                    <br />
                    {moment(cartItem.period.start).format("DD.MM.YYYY")} -{" "}
                    {moment(cartItem.period.end).format("DD.MM.YYYY")}
                  </div>
                  <div className="col-5 align-self-center">
                    {cartItem.products.map((product, pIndex) => (
                      <table key={`product_${product.id}`}>
                        <tbody>
                          <tr>
                            <td>
                              <img
                                className="img-fluid"
                                src={product.details.images[0].url}
                                style={{ maxHeight: "80px" }}
                              />
                            </td>
                            {product.accessories.length > 0 && (
                              <td className="pluscontainer">
                                <img src="static/images/add.png" />
                              </td>
                            )}
                            {product.accessories.map((accessory, aIndex) => [
                              <td key={`accessory_image${accessory.id}`}>
                                <img
                                  className="img-fluid"
                                  src={accessory.images[0].url}
                                  style={{ maxHeight: "80px" }}
                                />
                              </td>,
                              <td key={`accessory_more${accessory.id}`}
                                className={
                                  aIndex + 1 < product.accessories.length
                                    ? ""
                                    : "d-none"
                                }
                              >
                                <img src="static/images/add.png" />
                              </td>
                            ])}
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </div>
                  <div className="col-3 align-self-end pricing pr-0">
                    <h2>€ {this.state.cartUtils.getCartItemTotal(cartItem)}</h2>
                    <p>Excl. VAT & Security Deposit</p>
                    <button
                      onClick={() => this.configure(index)}
                      type="button"
                      className="configure-solid-yellow"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <h1>Remove Booking</h1>
              <p>Are you sure you want to remove the booking from your cart?</p>
              <button
                onClick={this.removeFromCartAndClose}
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

export default CheckoutBookingsOverview;
