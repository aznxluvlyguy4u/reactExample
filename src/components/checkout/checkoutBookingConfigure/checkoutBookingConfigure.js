import React, { Component } from "react";
import moment from "moment";
import CartUtils from "../../../utils/mapping/cart/cartUtils";
import Modal from "react-modal";
import styles from "./checkoutBookingConfigure.style";
import LocalStorageUtil from "../../../utils/localStorageUtil";

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
  }

  removeFromCartAndClose() {
    let cart = this.state.cart;
    cart.splice(this.state.cartIndex, 1);
    this.props.updateCart(cart);
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

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout-configure">
          <div className="checkout-wrapper">
            <h1>
              Overview{" "}
              <span>
                {" "}
                / <a> Checkout </a>/ <a> Pay </a>{" "}
              </span>
            </h1>
            <div className="paragraph">
              {this.state.cartItem &&
                this.state.cartItem.products.map((product, index) => (
                  <div>
                    <div className="row mb-2">
                      <div className="col-6">Product</div>
                      <div className="col-2">Qty</div>
                      <div className="col-2">Price</div>
                      <div className="col-2">Availability</div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-1 align-self-center">
                        <a onClick={() => this.openModalAndSetItem(index)}>
                          <img src="static/images/delete.png" />
                        </a>
                      </div>
                      <div className="col-5 align-items-center">
                        <div>
                        <div className="left">
                          {product.details && product.details.images && product.details.images.length > 0 && (
                            <img className="product-item" src={product.details.images[0].url} />
                          )}
                        </div>
                        <div className="left">
                            <h3>{product.details.name}</h3>
                            {product.details && product.details.rates && product.details.rates.length > 0 && (
                              <span class="grey">from € {product.details.rates[0].price}</span>
                            )}
                        </div>
                        </div>
                      </div>
                      <div className="col-2">

                      </div>
                      <div className="col-2">

                      </div>
                      <div className="col-2">

                      </div>
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

export default CheckoutBookingConfigure;
