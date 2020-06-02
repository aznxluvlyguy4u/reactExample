import React, { Component } from "react";
import moment from "moment";
import Modal from "react-modal";
import CartUtils from "../../../utils/mapping/cart/cartUtils";
import styles from "./checkout-overview-modal.style";
import RecommendedProducts from "../../recommended-products/recommendedProducts";
import { getRecomendedProductsByGroupIds } from "../../../utils/rest/requests/products";

class CheckoutBookingsOverview extends Component {
  constructor(props) {
    super(props);
    this.cartUtils = new CartUtils();

    this.state = {
      modalIsOpen: false,
      cart: props.cart,
      cartIndex: undefined,
      productBookingMap: props.productBookingMap,
      cartRows: [],
    };

    this.setCartDisplay();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.removeFromCartAndClose = this.removeFromCartAndClose.bind(this);
  }

  async setCartDisplay() {
    const cartRows = [];
    const productGroupIds = [];
    await this.state.cart.map((booking) => {
      if (!booking) return;
      
      const productAccessoryRows = [];
      let row = [];
      booking.products.map((product) => {
        if (row.length !== 0 && row.length % 3 === 0) {
          productAccessoryRows.push(row);
          row = [];
        }
        if (product.productGroup) {
          productGroupIds.push(product.productGroup.id);
        }

        row.push(
          this.cartUtils.getProductImage(
            this.state.productBookingMap,
            booking.id,
            product
          )
        );
        product.accessories.map((accessory) => {
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

    try {
      const recomendedProducts = await getRecomendedProductsByGroupIds(
        productGroupIds
      );
      this.setState({
        recomendedProducts: recomendedProducts.data,
      });
    } catch (err) {
      this.setState({
        recomendedProducts: [],
      });
    }
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

  afterOpenModal() {}

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const recomendedProducts = this.state.recomendedProducts || [];

    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout checkout-overview">
          <div className="checkout-wrapper">
            <h1 className="px-0 pb-5">
              Your Bookings
              <button
                onClick={() => this.configureAll()}
                className={
                  this.props.cart.length > 1 &&
                  this.props.cart.find((c) => !c.isAvailable) === undefined
                    ? "yellow-button-outline"
                    : "d-none"
                }
              >
                Configure All
              </button>
            </h1>
            <div className="container mt-4 pl-0 pr-0">
              {this.state.cartRows &&
                this.state.cart.map((cartItem, index) => {
                  if (!cartItem) return <div></div>;

                  return (
                    <div
                      key={cartItem.id}
                      className="row mb-2 equal-height-columns bottom-bordered"
                    >
                      <div className="col-1 align-self-center">
                        <a onClick={() => this.openModalAndSetItem(index)}>
                          <img src="/static/images/delete.png" />
                        </a>
                      </div>
                      <div className="col-3">
                        <h3 className="mb-3">
                          {cartItem.location.delivery.name}
                          {" - "}
                          {cartItem.location.collection.name}
                        </h3>
                        {moment(cartItem.period.start).format("DD.MM.YYYY")} -{" "}
                        {moment(cartItem.period.end).format("DD.MM.YYYY")}
                      </div>
                      <div className="col-5 align-self-center">
                        <table>
                          <tbody>
                            {this.state.cartRows &&
                              this.state.cartRows.length > 0 &&
                              this.state.cartRows.find(
                                (x) => x.id === cartItem.id
                              ) &&
                              this.state.cartRows
                                .find((x) => x.id === cartItem.id)
                                .productAccessoryRows.map((row, rIndex) => (
                                  <tr key={`containerrow${rIndex}`}>
                                    {row.map((item, iIndex) => [
                                      <td
                                        key={`accessory_image${item}${iIndex}`}
                                      >
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
                                        <img src="/static/images/add.png" />
                                      </td>,
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
                              (x) => x.id === cartItem.id
                            )
                          )}
                        </h2>
                        <p>Excl. VAT & Security Deposit</p>
                        <button
                          onClick={() => this.configure(index)}
                          type="button"
                          className={
                            cartItem.isAvailable
                              ? "configure-solid-yellow"
                              : "d-none"
                          }
                        >
                          Configure
                        </button>
                        <img
                          className={
                            cartItem.isAvailable ? "d-none" : "img-fluid"
                          }
                          src="/static/images/unavailable.png"
                          style={{ maxHeight: "20px" }}
                        />
                      </div>
                    </div>
                  );
                })}

              <div className="row mt-5">
                <div className="col-12">
                  <h3>Recommended Water Toys based on your booked Items</h3>
                  {recomendedProducts.length > 0 && (
                    <div style={{ position: "relative", top: "-65px" }}>
                      <RecommendedProducts
                        slideNumber={5}
                        products={recomendedProducts}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div
                  className="col banner"
                  style={{
                    background: "rgba(25, 48, 59, 0.6)",
                    padding: 0,
                    borderRadius: 5,
                  }}
                >
                  <div style={{ width: "100%", top: "20px" }} className="grid">
                    <div className="banner-left-title ">
                      <h1
                        style={{
                          color: "white",
                          borderBottom: 0,
                          paddingBottom: 0,
                        }}
                      >
                        Support
                      </h1>
                      <div className="banner-right-text" style={{ margin: 0 }}>
                        Available 24/7
                      </div>
                      <div
                        className="mt-4"
                        style={{
                          border: "2px solid #FAB900",
                          padding: 5,
                          color: "#FAB900",
                          textAlign: "center",
                        }}
                      >
                        +33 781 15 12 54
                      </div>
                    </div>

                    <div
                      style={{ display: "flex" }}
                      className="banner-right-text"
                    >
                      <div className="col-md-12" style={{ color: "white" }}>
                        <p style={{ color: "white" }}>
                          Checkout all your bookings at once, or manage them
                          seperately for different trips or different clients.
                        </p>
                        <p style={{ color: "white" }}>
                          Please do not hesitate to contact us for any questions
                          related to your bookings.
                        </p>
                      </div>
                    </div>
                  </div>
                  <img
                    style={{ borderRadius: 5 }}
                    src="/static/images/banner-image-2.png"
                  />
                </div>
              </div>
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
