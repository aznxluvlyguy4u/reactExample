import React, { Component, Fragment } from "react";
import CheckoutBookingConfigure from "./checkoutBookingConfigure";
import CheckoutBookingConfigureSummary from "./checkoutBookingConfigureSummary";
import CheckoutControl from "./checkout/checkoutControl";
import CheckoutPayForm from "../pay/checkoutPayForm";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";
import { handleGeneralError } from "../../../../utils/rest/error/toastHandler";
import PlaceOrderRequest from "../../../../utils/mapping/products/placeOrderRequest";
import { orderCartItems } from "../../../../utils/rest/requests/orders";
import moment from "moment";

const cartUtils = new CartUtils();

class CheckoutOverviewControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: props.cart,
      cartItemIndex: props.configureIndex,
      cartItem: props.cart[props.configureIndex],
      displaySection: {
        overview: true,
        checkout: false,
        pay: false,
      },
      validated: {
        overview: cartUtils.cartItemsAllAvailable(
          props.cart[props.configureIndex],
          props.productBookingMap
        ),
        checkout:
          props.cart[props.configureIndex].logistics &&
          props.cart[props.configureIndex].contactInformation &&
          props.cart[props.configureIndex].billingInformation,
        pay: false,
      },
      checkoutState: "logistics",
      configure: props.configure,
      configureAll: props.configureAll,
      loading: false,
    };
  }

  goToSection(section, cango) {
    if (cango) {
      this.setState({
        displaySection: {
          overview: section === "overview",
          checkout: section === "checkout",
          pay: section === "pay",
        },
      });
    }
  }

  updateCartItem(cartItemIndex, cartItem, refresh) {
    let cart = this.state.cart;
    if (cartItem) {
      cart[cartItemIndex] = cartItem;
    }

    this.setState({ cart });
    this.props.updateCart(cart, refresh);
  }

  setCheckoutState(state) {
    this.setState({ checkoutState: state });
  }

  updateSelectedPaymentMethod(value) {
    this.setState({ selectedPaymentMethod: value });
  }

  async setBankTransfer() {
    const cartItem = this.state.cartItem;
    const period = {
      start: moment(cartItem.period.start).set({
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
      end: moment(cartItem.period.end).set({
        minute: 0,
        second: 0,
        millisecond: 0,
      }),
    };
    const request = new PlaceOrderRequest(
      cartItem.location,
      period,
      cartItem.products,
      cartItem.contactInformation,
      cartItem.billingInformation,
      cartItem.logistics,
      "BANK_TRANSFER"
    ).returnOrder();

    return orderCartItems(request);
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout checkout-configure overview">
          <div className="checkout-wrapper container">
            {this.state.configure ? (
              <div className="row">
                <div className="col-8">
                  <h1 className="overview-sections">
                    <a
                      onClick={() => {
                        this.goToSection("overview", true);
                      }}
                    >
                      Overview{" "}
                      {this.state.validated.overview && (
                        <img
                          className="ml-2"
                          src="/static/images/yellow-elipse-tick.png"
                        />
                      )}
                    </a>
                    <span className="inactive"> / </span>
                    <span
                      className={
                        this.state.displaySection.checkout ||
                        this.state.displaySection.pay
                          ? "active"
                          : "inactive"
                      }
                    >
                      <a
                        onClick={() => {
                          this.goToSection(
                            "checkout",
                            this.state.validated.overview
                          );
                        }}
                      >
                        Checkout
                      </a>
                      {this.state.validated.checkout && (
                        <img
                          className="ml-2"
                          src="/static/images/yellow-elipse-tick.png"
                        />
                      )}
                    </span>
                    <span className="inactive"> / </span>
                    <span
                      className={
                        this.state.displaySection.pay ? "active" : "inactive"
                      }
                    >
                      <a
                        onClick={() => {
                          this.goToSection(
                            "pay",
                            this.state.validated.checkout
                          );
                        }}
                      >
                        Pay
                      </a>
                    </span>
                  </h1>
                  {this.state.displaySection.overview && (
                    <CheckoutBookingConfigure
                      availability={this.props.availability}
                      cart={this.state.cart}
                      products={this.props.products}
                      configureIndex={this.props.configureIndex}
                      updateProductCounter={this.props.updateProductCounter}
                      updateAccessoryCounter={this.props.updateAccessoryCounter}
                      productBookingMap={this.props.productBookingMap}
                      backToBookings={this.props.backToBookings}
                      updateCartItem={(cartItem) => {
                        this.updateCartItem(this.state.cartItemIndex, cartItem, true);
                      }}
                    />
                  )}
                  {this.state.displaySection.checkout && (
                    <CheckoutControl
                      cartItem={this.state.cartItem}
                      displayHeading={true}
                      updateCartItem={(cartItem) =>
                        this.updateCartItem(this.state.cartItemIndex, cartItem, false)
                      }
                      checkoutState={(state) => this.setCheckoutState(state)}
                      checkoutControlState={this.state.checkoutState}
                      moveToPayment={() =>
                        this.goToSection(
                          "pay",
                          this.state.cartItem.billingInformation
                        )
                      }
                    />
                  )}
                  {this.state.displaySection.pay && (
                    <CheckoutPayForm
                      cartItem={this.state.cartItem}
                      handleSubmit={this.handlePaymentMethod}
                      updateSelectedPaymentMethod={(value) =>
                        this.updateSelectedPaymentMethod(value)
                      }
                      completeBooking={() =>
                        this.props.completeBooking(
                          this.state.cartItemIndex,
                          false
                        )
                      }
                      productBookingMap={this.props.productBookingMap.find(
                        (p) => p.id === this.state.cartItem.id
                      )}
                    />
                  )}
                </div>
                <div className="col-4">
                  <div className="bordered-container">
                    {this.props.productBookingMap && (
                      <CheckoutBookingConfigureSummary
                        cartItem={this.state.cart[this.props.configureIndex]}
                        productBookingMap={this.props.productBookingMap}
                        availability={this.props.availability}
                      />
                    )}
                  </div>
                  <div className="mt-3">
                    {this.state.displaySection.overview && (
                      <Fragment>
                        <button
                          className="solid-grey"
                          type="button"
                          onClick={this.props.backToBookings}
                        >
                          Update Booking
                        </button>
                      </Fragment>
                    )}
                    {this.state.displaySection.overview &&
                      this.state.validated.overview && (
                        <Fragment>
                          <button
                            type="button"
                            className="search-button-full mt-3"
                            onClick={() => {
                              this.goToSection(
                                "checkout",
                                this.state.validated.overview
                              );
                            }}
                            disabled={!this.state.validated.overview}
                          >
                            Checkout
                          </button>
                        </Fragment>
                      )}
                    {this.state.displaySection.checkout && (
                      <button
                        type="submit"
                        className="search-button-full"
                        form={`${this.state.checkoutState}-form`}
                        value="Submit"
                      >
                        Next
                      </button>
                    )}
                    {this.state.displaySection.pay &&
                      this.state.selectedPaymentMethod === "BANK_TRANSFER" && (
                        <button
                          type="text"
                          className="yellow-outline-button mt-3"
                          disabled={this.state.loading ? "true" : ""}
                          onClick={async () => {
                            try {
                              await this.setState({ loading: true });
                              await this.setBankTransfer();
                              this.props.completeBooking(
                                this.state.cartItemIndex,
                                true
                              );
                              await this.setState({ loading: false });
                            } catch (err) {
                              handleGeneralError(err);
                              await this.setState({ loading: false });
                            }
                          }}
                        >
                          Complete Booking
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <h1>Configure All</h1>
            )}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutOverviewControl;
