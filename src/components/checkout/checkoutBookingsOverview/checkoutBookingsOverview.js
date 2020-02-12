import React, { Component } from "react";
import moment from "moment";

class CheckoutBookingsOverview extends Component {
  constructor(props) {
    super(props);

    let cart = props.cart;
    const ct = cart.map((cartItem, index) => {
      cartItem.products.map((product, pIndex) => {
        product.details = props.products.filter(x => x.id == product.id)[0];
        return product;
      });
      return cartItem;
    });


    this.state = { cart: ct };
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="page-wrapper">
          <div className="checkout-wrapper">
            <h1>
              Bookings
              <button className="yellow-button-outline" style={{float: 'right'}}>
                Configure All
              </button>
            </h1>
            <div className="paragraph">
              {this.state.cart.map((cartItem, index) => (
                <div class="row mb-2">
                  <div class="col-1">X</div>
                  <div class="col-3">
                    <h3>{cartItem.label}</h3>
                    <br />
                    {moment(cartItem.period.start).format("DD.MM.YYYY")} - {moment(cartItem.period.end).format("DD.MM.YYYY")}
                  </div>
                  <div class="col-5">
                  {cartItem.products.map((product, pIndex) => (
                    <div>
                      <img class="img-fluid" src={product.details.images[0].url} style={{maxHeight:'80px'}}/>
                      {product.accessories.map((accessory, pIndex) => (
                        <img class="img-fluid"  src={accessory.images[0].url}  style={{maxHeight:'80px'}}/>
                      ))}
                    </div>
                  ))}
                  </div>
                  <div class="col-3">X</div>
                </div>
              ))}
              <div className="content-wrapper">
                <div className="first">{`${this.props.cart.length} items`}</div>
                <div className="second">
                  {`€${this.props.totalPrice ? this.props.totalPrice : 0.0}`}
                </div>
              </div>
            </div>
            {/* ) : null} */}
            <div className="paragraph">
              <h3>Delivery fees</h3>
              <div className="content-wrapper">
                <div className="first">To be determined at Final Checkout!</div>
                <div className="second">€ -</div>
              </div>
            </div>
            <div className="paragraph no-line">
              <div className="content-wrapper">
                <div className="first bold">Total Rental Price</div>
                <div className="second bold">{`€${
                  this.props.totalPrice ? this.props.totalPrice : 0.0
                }`}</div>
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
