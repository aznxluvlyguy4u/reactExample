import React, { Component } from "react";
import moment from "moment";
import CartUtils from "../../../utils/mapping/cart/cartUtils";

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

    this.state = { cart: ct, cartUtils: new CartUtils() };
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper checkout-overview">
          <div className="checkout-wrapper">
            <h1>
              Bookings
              <button
                className="yellow-button-outline"
              >
                Configure All
              </button>
            </h1>
            <div className="paragraph">
              {this.state.cart.map((cartItem, index) => (
                <div class="row mb-2">
                  <div class="col-1 align-self-center">
                    <a>
                      <img src="static/images/delete.png" />
                    </a>
                  </div>
                  <div class="col-3">
                    <h3>{cartItem.label}</h3>
                    <br />
                    {moment(cartItem.period.start).format("DD.MM.YYYY")} -{" "}
                    {moment(cartItem.period.end).format("DD.MM.YYYY")}
                  </div>
                  <div class="col-5">
                    {cartItem.products.map((product, pIndex) => (
                      <div>
                        <img
                          class="img-fluid"
                          src={product.details.images[0].url}
                          style={{ maxHeight: "80px" }}
                        />
                        {product.accessories.map((accessory, pIndex) => (
                          <img
                            class="img-fluid"
                            src={accessory.images[0].url}
                            style={{ maxHeight: "80px" }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div class="col-3 align-self-end pricing">
                    <h2>€ {this.state.cartUtils.getCartItemTotal(cartItem)}</h2>
                    <p>Excl. VAT & Security Deposit</p>
                    <button type="button" className="configure-solid-yellow">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
              <div className="content-wrapper">
                <div className="first">{`${this.props.cart.length} items`}</div>
                <div className="second">
                  {`€${this.props.totalPrice ? this.props.totalPrice : 0.0}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingsOverview;
