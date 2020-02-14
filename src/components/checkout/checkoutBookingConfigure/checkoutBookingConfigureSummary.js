import React, { Component } from "react";
import CartUtils from "../../../utils/mapping/cart/cartUtils";

class CheckoutBookingConfigureSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartUtils: new CartUtils()
    };
  }

  render() {
    if (this.props.cartItem) {
      return (
        <div className="page-wrapper checkout-configure checkout-configure-summary">
          <div className="checkout-wrapper">
            <h1>
              {this.props.cartItem.location.delivery.name} -{" "}
              {this.props.cartItem.location.collection.name}
            </h1>
            <div className="row mb-3">
              <div className="col-5 rowHead">Rental Period</div>
              <div className="col-7">
                {this.state.cartUtils.dayCount(this.props.cartItem)} days
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-5 rowHead">Pick-Up</div>
              <div className="col-7">
                {this.props.cartItem.location.delivery.name}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-5 rowHead">Drop-Off</div>
              <div className="col-7">
                {this.props.cartItem.location.collection.name}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-5 rowHead">Nr. of Items</div>
              <div className="col-7">
                {this.state.cartUtils.getItemCount(this.props.cartItem)}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-5 rowHead">Notes</div>
              <div className="col-7">
                A security deposit will be charged before picking up your order.
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-5 self-align-center text-center">
                <img
                  className="availabilityImage"
                  src="static/images/alert.png"
                />
              </div>
              <div className="col-7">
                Please click on the Availability Icons for more information.
              </div>
            </div>
            <div className="divider my-3"></div>
            <div className="row costs">
              <div className="col-8">Rental Fee</div>
              <div className="col-4">
              € {this.state.cartUtils.getCartItemTotal(this.props.cartItem)}
              </div>
            </div>
            <div className="col-8">
              <img
                src="static/images/down.png"
                style={{
                  width: "10px",
                  height: "10px",
                  "margin-right": "5px"
                }}
              />
              Transport Costs
            </div>
            <div className="col-4">€ 0.00</div>
            <div className="row costs">
              <div className="col-8 rowHead">Total Costs</div>
              <div className="col-4">
              € {this.state.cartUtils.getCartItemTotal(this.props.cartItem)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigureSummary;
