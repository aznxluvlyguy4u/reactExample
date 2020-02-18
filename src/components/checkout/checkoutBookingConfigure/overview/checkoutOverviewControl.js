import React, { Component } from "react";
import CheckoutBookingConfigure from "./checkoutBookingConfigure";
import CheckoutBookingConfigureSummary from "./checkoutBookingConfigureSummary";
import CheckoutControl from "./checkout/checkoutControl";

class CheckoutOverviewControl extends Component {
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
      cart: ct,
      cartItemIndex: props.configureIndex,
      cartItem,
      displaySection: {
        overview: true,
        checkout: false,
        pay: false
      },
      checkoutState: 'logistics',
      configure: props.configure,
      configureAll: props.configureAll
    };
  }

  goToSection(section) {
    this.setState({
      displaySection: {
        overview: section === "overview",
        checkout: section === "checkout",
        pay: section === "pay"
      }
    });
  }

  updateCartItem(cartItemIndex, cartItem) {
    let cart = this.state.cart;
    cart[cartItemIndex] = cartItem;
    this.setState({ cart });
    this.props.updateCart(cart);
  }

  setCheckoutState(state) {
    this.setState({ checkoutState: state });
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout-configure overview">
          <div className="checkout-wrapper">
            {this.state.configure ? (
              <div className="row">
                <div className="col-8">
                  <h1>
                    <a
                      onClick={() => {
                        this.goToSection("overview");
                      }}
                    >
                      Overview
                    </a>{" "}
                    <span>
                      {" "}
                      /{" "}
                      <a
                        onClick={() => {
                          this.goToSection("checkout");
                        }}
                      >
                        {" "}
                        Checkout{" "}
                      </a>{" "}
                      /{" "}
                      <a
                        onClick={() => {
                          this.goToSection("pay");
                        }}
                      >
                        {" "}
                        Pay{" "}
                      </a>{" "}
                    </span>
                  </h1>
                  {this.state.displaySection.overview && (
                    <CheckoutBookingConfigure
                      cart={this.state.cart}
                      products={this.props.products}
                      configureIndex={this.props.configureIndex}
                    />
                  )}
                  {this.state.displaySection.checkout && (
                    <CheckoutControl
                      cartItem={this.state.cartItem}
                      displayHeading={true}
                      updateCartItem={cartItem =>
                        this.updateCartItem(this.state.cartItemIndex, cartItem)
                      }
                      checkoutState={state => this.setCheckoutState(state)}
                    />
                  )}
                  {this.state.displaySection.pay && <h1>pay</h1>}
                </div>
                <div className="col-4">
                  <CheckoutBookingConfigureSummary
                    cartItem={this.state.cart[this.props.configureIndex]}
                  />
                  <div className="px-2">
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
