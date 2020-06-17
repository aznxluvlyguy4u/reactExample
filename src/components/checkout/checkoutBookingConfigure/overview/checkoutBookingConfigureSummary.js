import React, { Component } from "react";
import moment from "moment";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";

class CheckoutBookingConfigureSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartUtils: new CartUtils(),
      tCostsExpanded: false,
    };
  }

  render() {
    if (this.props.cartItem) {
      const availability = this.props.availability;

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
            <div className="col-5">
              <strong>Pick-Up</strong>
              <br />
              12:00 PM
            </div>
            <div className="col-7">
              <strong>
                {moment(this.props.cartItem.period.start).format("DD.MM.YYYY")}
              </strong>
              <br />
              {this.props.cartItem.location.delivery.name}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-5">
              <strong>Drop-Off</strong>
              <br />
              12:00 PM
            </div>
            <div className="col-7">
              <strong>
                {moment(this.props.cartItem.period.end).format("DD.MM.YYYY")}
              </strong>
              <br />
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
              Security deposit will be charged before delivery.
            </div>
          </div>
          {/* <div
            className={
              this.state.cartUtils.cartItemsAllAvailable(
                this.props.cartItem,
                this.props.productBookingMap
              )
                ? "d-none"
                : "row mb-3"
            }
          >
            <div className="col-5 self-align-center text-center">
              <img
                className="availabilityImage"
                src="/static/images/alert.png"
              />
            </div>
            <div className="col-7">
              Please click on the Availability Icons for more information.
            </div>
          </div> */}
          <div className="divider my-3"></div>
          <div className="row costs mt-2">
            <div className="col-8">Rental Fee</div>
            <div className="col-4">
              €{" "}
              {this.state.cartUtils.getCartItemRentalFee(
                this.props.productBookingMap.find(
                  (p) => p.id === this.props.cartItem.id
                )
              )}
            </div>
          </div>
          <div className="row costs mt-2">
            <div
              className="col-8"
              onClick={(e) => {
                this.setState({
                  tCostsExpanded: !this.state.tCostsExpanded,
                });
              }}
            >
              {!this.state.tCostsExpanded && (
                <img
                  src="/static/images/down.png"
                  style={{
                    width: "10px",
                    height: "5px",
                    marginRight: "5px",
                  }}
                />
              )}
              {this.state.tCostsExpanded && (
                <img
                  src="/static/images/up.png"
                  style={{
                    width: "10px",
                    height: "5px",
                    marginRight: "5px",
                  }}
                />
              )}
              Transport Costs
            </div>
            <div className="col-4">
              €{" "}
              {
                // this.state.cartUtils.getCartItemTransportCosts(
                //   this.props.productBookingMap.find(
                //     (p) => p.id === this.props.cartItem.id
                //   )
                // ) 
                parseFloat(availability.totalTransportCosts || 0).toFixed(2)
              }
            </div>
          </div>
          {this.state.tCostsExpanded && (
            <div>
              <div className="row costs mt-2">
                <div className="col-8">Delivery {"&"} Pickup</div>
                {availability && (
                  <div className="col-4">
                    € {availability.totalDeliveryOnBoard}
                  </div>
                )}
                {!availability && (
                  <div className="col-4">
                    € 0.00
                  </div>
                )}
              </div>
              <div className="row costs mt-2">
                <div className="col-8">Shipping</div>
                {availability && (
                  <div className="col-4">
                    € {availability.totalShippingCosts}
                  </div>
                )}
                {!availability && (
                  <div className="col-4">
                    € 0.00
                  </div>
                )}
              </div>
              <div className="row costs mt-2">
                <div className="col-8">Reallocation</div>
                {availability && (
                  <div className="col-4">
                    € {availability.totalRelocationFees}
                  </div>
                )}
                {!availability && (
                  <div className="col-4">
                    € 0.00
                  </div>
                )}
              </div>
              <div className="row costs mt-2">
                <div className="col-8">Handeling</div>
                {availability && (
                  <div className="col-4">
                    € {availability.totalHandlingCosts}
                  </div>
                )}
                {!availability && (
                  <div className="col-4">
                    € 0.00
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="row costs mt-2">
            <div className="col-8 rowHead">Total Costs</div>
            <div className="col-4">
              €{" "}
              {/* {availability.grandTotalPrice} */}
              {this.state.cartUtils.getCartItemTotal(
                this.props.cartItem,
                this.props.productBookingMap.find(
                  (p) => p.id === this.props.cartItem.id
                )
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigureSummary;
