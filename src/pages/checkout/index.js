import moment from "moment";
import React, { Component, Fragment } from "react";
import Router from "next/router";
import Modal from "react-modal";
import { connect } from "react-redux";
import Loader from "../../components/loader";
import Default from "../../layouts/default";
import { checkCartAvailability } from "../../utils/rest/requests/cart";
import LocalStorageUtil from "../../utils/localStorageUtil";
import {
  emptyCart,
  setCart,
  addToCart,
  removeFromCart,
} from "../../actions/cartActions";
import CheckoutBookingsOverview from "../../components/checkout/checkoutBookingsOverview/checkoutBookingsOverview";
import CheckoutOverviewControl from "../../components/checkout/checkoutBookingConfigure/overview/checkoutOverviewControl";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      bookingsOverview: true,
      configure: false,
      configureIndex: undefined,
      configureAll: false,
      orderFailed: false,
      orderSuccess: false,
    };
  }

  async componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    let cart = await this.getValidatedCartItems();
    await this.setState({ cart });

    if (this.state.cart && this.state.cart.length > 0) {
      this.setState({ loading: true });
      const orderRequests = await this.getProductsFromCartItems();
      await checkCartAvailability(orderRequests).then(response => {
        this.setBookingAvailabilityMap(response.data.products);
      });
    } else {
      
    }
  }

  async getValidatedCartItems() {
    const cart = LocalStorageUtil.getCart();
    if (cart) {
      await cart.map((booking) => {
        if (moment(booking.period.start).isSameOrBefore(moment(new Date()))) {
          booking.isAvailable = false;
        } else {
          booking.isAvailable = true;
        }
      });
    }
    return cart;
  }

  async getProductsFromCartItems() {
    const orderRequests = [];
    if (!this.state.cart) {
      return [];
    }
    this.state.cart.map(orderItem => {
      if (orderItem.isAvailable) {
        orderItem.products.map(product => {
          orderRequests.push({
            id: product.id,
            quantity: product.quantity,
            location: orderItem.location,
            period: {
              start: moment(orderItem.period.start).format(
                "YYYY-MM-DDTHH:mm:ss.000Z"
              ),
              end: moment(orderItem.period.end).format("YYYY-MM-DDTHH:mm:ss.000Z")
            },
            accessories: product.accessories
          });
          return;
        });
        return;
      } else {
        return;
      }
    });
    return orderRequests;
  }

  async setBookingAvailabilityMap(productAvailability) {
    const productBookingMap = [];
    this.state.cart.map(booking => {
      booking.products.map(product => {
        const availabilityIndex = productAvailability.findIndex(
          productLookup => {
            return (
              productLookup.id === product.id &&
              moment(productLookup.period.start).isSame(
                moment(booking.period.start)
              ) &&
              moment(productLookup.period.end).isSame(
                moment(booking.period.end)
              ) &&
              productLookup.location.delivery.id ===
                booking.location.delivery.id &&
              productLookup.location.collection.id ===
                booking.location.collection.id
            );
          }
        );
        if (availabilityIndex > -1) {
          const mapIndex = productBookingMap.findIndex(
            bookingMap => bookingMap.id === booking.id
          );
          if (mapIndex > -1) {
            productBookingMap[mapIndex].availability.push(
              productAvailability[availabilityIndex]
            );
          } else {
            productBookingMap.push({
              id: booking.id,
              availability: [productAvailability[availabilityIndex]]
            });
          }
        }
      });
    });
    await this.setState({ productBookingMap, loading: false });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      orderFormStep: 1
    });
  };

  quantityText(item) {
    if (
      item.quantityAvailable !== 0 &&
      item.quantity > item.quantityAvailable
    ) {
      return `Only ${item.quantityAvailable} are available! Would you like to change the Selected Quantity? <br />`;
    }
  }

  checkStoreText(item) {
    if (
      item.stock.stores.alternative.length > 0 &&
      item.stock.stores.alternative.length === item.quantityAvailable
    ) {
      // alleen available in alternative store dus extra fee
      return "<br />Items need to be shipped from further away. An extra transport fee will apply";
    }
    if (
      item.stock.stores.gray.length > 0 &&
      item.stock.stores.gray.length === item.quantityAvailable
    ) {
      // alleen available in grey store dus extra fee
      return "<br />Items need to be shipped from further away. An extra transport fee will apply";
    }
    if (
      item.stock.stores.native.length > 0 &&
      item.stock.stores.gray.length === item.quantityAvailable
    ) {
      // alleen available in native store dus goed
    }
    if (
      item.stock.stores.newItems.length > 0 &&
      item.stock.stores.newItems.length === item.quantityAvailable
    ) {
      // alleen available in newItems store dus mogelijk extra fee
      return "Items need to be shipped from further away. An extra transport fee will apply";
    }
  }

  updateCart(cart) {
    this.setState({ cart });
    this.props.setCart(cart);
    LocalStorageUtil.setCart(cart);
  }

  closeSuccessModal = () => {
    if (this.state.configureAll && this.state.cart.length > 0) {
      this.setConfigureAll();
      this.setState({
        orderSuccess: false,
      });
    } else {
      this.setState({
        bookingsOverview: true,
        orderSuccess: false,
        configureAll: false,
        configure: false,
        configureIndex: undefined,
      });
    }
  };

  closeFailedModal = () => {
    this.setState({
      orderFailed: false
    });
  };

  resize() {
    this.setState({ isMobile: window.innerWidth <= 760 });
  }

  setConfigureItem(cartItemIndex) {
    this.setState({
      bookingsOverview: false,
      configure: true,
      configureIndex: cartItemIndex
    });
  }

  setConfigureAll() {
    this.setState({
      bookingsOverview: false,
      configure: true,
      configureIndex: 0,
      configureAll: true,
    });
  }

  backToBookings() {
    this.setState({
      bookingsOverview: true,
      configure: false,
      configureIndex: undefined
    });
  }

  revertToCartBookingsOverview() {
    this.setState({
      bookingsOverview: true,
      configure: false,
      configureAll: false,
      configureIndex: undefined,
    });
  }

  captureCheckoutRequirements() {
    this.setState({
      configure: false,
      configureAll: false
    });
  }

  async completeBooking(cartItemIndex, pending) {
    this.setState({
      loading: true,
    });
    if (cartItemIndex !== undefined) {
      let cartItem = this.state.cart[cartItemIndex];
      let cart = this.state.cart;
      await cart.splice(cartItemIndex, 1);
      if (pending) {
        LocalStorageUtil.setCartItemPendingPayment(cartItem);
      } else {
        LocalStorageUtil.setCartItemPaid(cartItem);
      }
      this.props.setCart(cart);
      LocalStorageUtil.setCart(cart);
      await this.setState({
        loading: false,
        orderSuccess: true,
      });
    }
  }

  async updateProductCounter(cartId, productId, productCount) {
    this.setState({ loading: true });
    const cart = this.state.cart;
    const cartItem = cart.find(c => c.id === cartId);
    const product = cartItem && cartItem.products ? cartItem.products.find(p => p.id === productId) : undefined;
    if (product) {
      product.quantity = productCount;
      await this.setState({ cart });
      this.props.setCart(cart);
      LocalStorageUtil.setCart(cart);
      const orderRequests = await this.getProductsFromCartItems();
      await checkCartAvailability(orderRequests).then(response => {
        this.setBookingAvailabilityMap(response.data.products);
      });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  async updateAccessoryCounter(cartId, productId, accessoryId, accessoryCount) {
    this.setState({ loading: true });
    const cart = this.state.cart;
    const cartItem = cart.find(c => c.id === cartId);
    const product = cartItem && cartItem.products ? cartItem.products.find(p => p.id === productId) : undefined;
    const accessory = product && product.accessories ? product.accessories.find(a => a.id === accessoryId) : undefined;

    if (accessory) {
      accessory.quantity = accessoryCount;
      await this.setState({ cart });
      this.props.setCart(cart);
      LocalStorageUtil.setCart(cart);
      const orderRequests = await this.getProductsFromCartItems();
      await checkCartAvailability(orderRequests).then(response => {
        this.setBookingAvailabilityMap(response.data.products);
      });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Default
        nav="fixed"
        search
        meta={{
          title: "checkout page | OCEAN PREMIUM",
          description:
            "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
        }}
      >
        {!this.state.loading &&
        this.state.bookingsOverview &&
        this.state.productBookingMap &&
        this.props.cartReducer.items.length > 0 ? (
          <CheckoutBookingsOverview
            setConfigureAll={this.setConfigureAll.bind(this)}
            setConfigureItem={cartItemIndex =>
              this.setConfigureItem(cartItemIndex)
            }
            updateCart={this.updateCart.bind(this)}
            cart={this.state.cart}
            productBookingMap={this.state.productBookingMap}
          />
        ) : (
          <Fragment>
            {!this.state.loading && this.props.cartReducer.items.length === 0 && (
              <div className="page-wrapper checkout checkout-overview">
                <div className="checkout-wrapper">
                  <p style={{ textAlign: "center" }}>
                    Your cart is empty
                  </p>
                </div>
              </div>
            )}
          </Fragment>
        )}

        {this.state.loading ? <Loader /> : null}

        {!this.state.loading &&
          this.state.configure &&
          this.state.configureIndex !== undefined &&
          this.state.cart[this.state.configureIndex] &&
          this.state.productBookingMap && (
            <CheckoutOverviewControl
              cart={this.state.cart}
              configureIndex={this.state.configureIndex}
              configure={true}
              backToBookings={this.backToBookings.bind(this)}
              updateCart={this.updateCart.bind(this)}
              completeBooking={this.completeBooking.bind(this)}
              updateProductCounter={this.updateProductCounter.bind(this)}
              updateAccessoryCounter={this.updateAccessoryCounter.bind(this)}
              productBookingMap={this.state.productBookingMap}
            />
          )}

        {this.state.orderSuccess && (
          <Modal
            isOpen={this.state.orderSuccess}
            shouldCloseOnOverlayClick={false}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeSuccessModal}
            style={customStyles}
          >
            <h1>Order Sent</h1>
            <p>
              Thanks for your inquiry! We will get back to you as quickly as
              possible!
            </p>
            <p>Please check your Email inbox for the details</p>
            <a
              className="button-border fullwidth"
              onClick={e => {
                this.closeSuccessModal();
              }}
            >
              Done
            </a>
            {this.state.loading ? <Loader /> : null}
          </Modal>
        )}

        {this.state.orderFailed && (
          <Modal
            isOpen={this.state.orderFailed}
            shouldCloseOnOverlayClick={false}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeFailureModal}
            style={customStyles}
          >
            <h1>Your payment failed Request Failed</h1>
            <p>
              This may be due to slow internet! Please retry the reservation
            </p>
            <a
              className="button-border fullwidth"
              onClick={e => {
                this.closeFailedModal();
              }}
            >
              Retry
            </a>
          </Modal>
        )}
      </Default>
    );
  }
}

const mapStateToProps = ({ localSearchReducer, cartReducer }) => {
  return {
    localSearchReducer,
    cartReducer
  };
};

export default connect(mapStateToProps, {
  addToCart,
  removeFromCart,
  emptyCart,
  setCart
})(CheckoutPage);
