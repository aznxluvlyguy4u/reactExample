import React, { Component } from "react";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";

class CheckoutBookingConfigureSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartUtils: new CartUtils()
    };
  }

  render() {
    if (this.props.cartItem) {
      const item = this.props.productBookingMap.find(p => p.id === this.props.cartItem.id);
      const availability = (item.availability && item.availability.length > 0) ? item.availability[0] : null

      return (
        <div className="checkout-configure checkout-configure-summary">
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
          <div className={this.state.cartUtils.cartItemsAllAvailable(this.props.cartItem, this.props.productBookingMap) ? 'd-none' : 'row mb-3'}>
            <div className="col-5 self-align-center text-center">
              <img
                className="availabilityImage"
                src="/static/images/alert.png"
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
              € {this.state.cartUtils.getCartItemTotal(this.props.cartItem, this.props.productBookingMap.find(p => p.id === this.props.cartItem.id))}
            </div>
          </div>
          <div className="row costs">
            <div className="col-8">
              <img
                src="/static/images/down.png"
                style={{
                  width: "10px",
                  height: "5px",
                  marginRight: "5px"
                }}
              />
              Transport Costs
            </div>
            <div className="col-4">€ {this.state.cartUtils.getCartItemTransportCosts(this.props.productBookingMap.find(p => p.id === this.props.cartItem.id))/*availability.totalTransportCosts*/}</div>
          </div>
          <div className="row costs">
            <div className="col-8 rowHead">Total Costs</div>
            <div className="col-4">
              € {this.state.cartUtils.getCartItemTotal(this.props.cartItem, this.props.productBookingMap.find(p => p.id === this.props.cartItem.id))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigureSummary;
