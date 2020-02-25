import React, { Component } from "react";
import moment from "moment";
import CartUtils from "../../../utils/mapping/cart/cartUtils";
import Modal from "react-modal";
import styles from "./checkout-overview-modal.style";

class CheckoutBookingsOverview extends Component {
  constructor(props) {
    super(props);
    this.cartUtils = new CartUtils();

    this.state = {
      modalIsOpen: false,
      cart: props.cart,
      cartIndex: undefined,
      productBookingMap: props.productBookingMap,
      cartRows: []
    };

    this.setCartDisplay();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeFromCartAndClose = this.removeFromCartAndClose.bind(this);
  }

  async setCartDisplay() {
    const cartRows = [];
    await this.state.cart.map(booking => {
      const productAccessoryRows = [];
      let row = [];
      booking.products.map(product => {
        if (row.length !== 0 && row.length % 3 === 0) {
          productAccessoryRows.push(row);
          row = [];
        }
        row.push(
          this.cartUtils.getProductImage(
            this.state.productBookingMap,
            booking.id,
            product
          )
        );
        product.accessories.map(accessory => {
          if (row.length !== 0 && row.length % 3 === 0) {
            productAccessoryRows.push(row);
            row = [];
          }
          row.push(accessory.images[0].url);
        });
      });
      if (row.length > 0) {
        productAccessoryRows.push(row);
      }

      cartRows.push({ id: booking.id, productAccessoryRows });
      return;
    });

    this.setState({ cartRows });
  }

  removeFromCartAndClose() {
    let cart = this.state.cart;
    cart.splice(this.state.cartIndex, 1);
    this.props.updateCart(cart);
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
                className={
                  this.props.cart.length > 1
                  && this.props.cart.find(c => !c.isAvailable) === undefined
                    ? "yellow-button-outline"
                    : "d-none"
                }
              >
                Configure All
              </button>
            </h1>
            <div className="container">
              {this.state.cartRows &&
                this.state.cart.map((cartItem, index) => (
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
                      {moment(cartItem.period.start).format(
                        "DD.MM.YYYY"
                      )} - {moment(cartItem.period.end).format("DD.MM.YYYY")}
                    </div>
                    <div className="col-5 align-self-center">
                      <table>
                        <tbody>
                          {this.state.cartRows &&
                            this.state.cartRows.length > 0 &&
                            this.state.cartRows.find(
                              x => x.id === cartItem.id
                            ) &&
                            this.state.cartRows
                              .find(x => x.id === cartItem.id)
                              .productAccessoryRows.map(row => (
                                <tr>
                                  {row.map((item, iIndex) => [
                                    <td key={`accessory_image${item}${iIndex}`}>
                                      <img
                                        className="img-fluid"
                                        src={item}
                                        alt="Item image"
                                        style={{ maxHeight: "80px" }}
                                      />
                                    </td>,
                                    <td
                                      key={`accessory_more${item}${iIndex}`}
                                      className={
                                        iIndex + 1 < row.length
                                          ? ""
                                          : "d-none"
                                      }
                                    >
                                      <img src="static/images/add.png" />
                                    </td>
                                  ])}
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-3 align-self-end pricing pr-0">
                      <h2>
                        €{" "}
                        {this.cartUtils.getCartItemTotal(
                          cartItem,
                          this.state.productBookingMap.find(
                            x => x.id === cartItem.id
                          )
                        )}
                      </h2>
                      <p>Excl. VAT & Security Deposit</p>
                      <button
                        onClick={() => this.configure(index)}
                        type="button"
                        className={cartItem.isAvailable ? "configure-solid-yellow" : "d-none"}
                      >
                        Configure
                      </button>
                      <img className={cartItem.isAvailable ? "d-none" : "img-fluid"} src="static/images/unavailable.png" style={{maxHeight: '20px'}}/>
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
