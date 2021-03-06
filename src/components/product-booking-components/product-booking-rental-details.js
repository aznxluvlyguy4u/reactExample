import React, { Component, Fragment } from "react";
import { isEmpty } from "lodash";
import Link from "next/link";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import rootReducer from "../../reducers/rootReducer";
import LocalStorageUtil from "../../utils/localStorageUtil";
import { checkCartAvailability } from "../../utils/rest/requests/cart";

class ProductBookingRentalDetails extends Component {
  constructor(props) {
    super(props);
    const cart = LocalStorageUtil.getCart() || [];
    const cartItem = cart[props.cartItemIndex];
    const start = moment(cart[props.cartItemIndex].period.start).endOf("day");
    const end = moment(cart[props.cartItemIndex].period.end).endOf("day");
    const dayCount = end.diff(start, "days");
    const cartItemProductIndex = cartItem.products.findIndex(
      (p) => p.id === props.product.id
    );
    const cartItemProduct = cartItem.products[cartItemProductIndex];
    const accessories = cartItemProduct.accessories.filter(
      (x) => x.quantity > 0
    );

    let rentalFee =
      Number(props.product.rates[0].price) *
      parseInt(cartItemProduct.quantity) *
      dayCount;
    accessories.map((item) => {
      if (item.rates) {
        let itemRateFee =
          dayCount * Number(item.rates[0].price) * item.quantity;
        rentalFee += itemRateFee;
      }
    });

    this.state = {
      dayCount,
      cartItem,
      cartItemProduct,
      accessories,
      rentalFee,
      product: null,
      tCostsExpanded: false,
      availability: null,
    };
  }

  async componentDidMount() {
    if (this.state.cartItem) {
      const orderRequests = await this.getProductsFromCartItem(
        this.state.cartItem
      );
      if (orderRequests.length > 0) {
        try {
          const response = await checkCartAvailability(orderRequests);
          if (response.code != 201) {
            return;
          }

          if (
            !response.data &&
            !response.data.products &&
            response.data.products.length == 0
          )
            return;

          const product = response.data.products[0];
          this.setState({ product, availability: response.data });
        } catch (err) {
          console.log(err);
        }
      } else {
        this.setState({
          product: null,
        });
      }
    }
  }

  async getProductsFromCartItem(cartItem) {
    const orderRequests = [];
    if (!cartItem) {
      return [];
    }
    cartItem.products.map((product) => {
      orderRequests.push({
        id: product.id,
        quantity: product.quantity,
        location: cartItem.location,
        period: {
          start: moment(cartItem.period.start)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss.000Z"),
          end: moment(cartItem.period.end)
            .endOf("day")
            .format("YYYY-MM-DDTHH:mm:ss.000Z"),
        },
        accessories: product.accessories,
      });
      return;
    });
    return orderRequests;
  }

  render() {
    const product = this.state.product;
    const availability = this.state.availability;

    return (
      <div>
        <div className="form rental-details">
          <h3 className="main-title">Rental Details</h3>
          <div className="row mb-2">
            <div className="col-4">
              <strong>Rental Period</strong>
            </div>
            <div className="col-8">
              {this.state.dayCount > 1
                ? `${this.state.dayCount} days`
                : `${this.state.dayCount} day`}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              <strong>Pick-Up</strong>
              <br />
              12:00 PM
            </div>
            <div className="col-8">
              <strong>
                {moment(this.state.cartItem.period.start).format("DD.MM.YYYY")}
              </strong>
              <br />
              {this.state.cartItem.location.delivery.name}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              <strong>Drop-Off</strong>
              <br />
              12:00 PM
            </div>
            <div className="col-8">
              <strong>
                {moment(this.state.cartItem.period.end).format("DD.MM.YYYY")}
              </strong>
              <br />
              {this.state.cartItem.location.collection.name}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              <strong>Items</strong>
            </div>
            <div className="col-8">
              {this.state.cartItemProduct.quantity} x{" "}
              {this.props.product.description &&
              this.props.product.description.section1 &&
              this.props.product.description.section1.head
                ? this.props.product.description.section1.head
                : this.props.product.name}
              <br />
              {this.state.accessories.map((accessory) => (
                <div key={accessory.id}>
                  {accessory.quantity} x {accessory.name}
                </div>
              ))}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-4">
              <strong>Notes</strong>
            </div>
            <div className="col-8">
              Security deposit will be charged before delivery.
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <hr className="page-divide" />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-8">Rental Fee</div>
            {availability && (
              <div className="col-4 text-right">
                € {Number(availability.totalPrice).toFixed(2)}
              </div>
            )}
          </div>
          <div className="row mt-2">
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
            {!availability && (
              <div className="col-4 text-right">Loading...</div>
            )}
            {availability && availability.totalTransportCosts && (
              <div className="col-4 text-right">
                € {Number(availability.totalTransportCosts).toFixed(2)}
              </div>
            )}
          </div>

          {this.state.tCostsExpanded && (
            <div>
              <div className="row mt-2">
                <div className="col-8">Delivery {"&"} Pickup</div>
                {availability && (
                  <div className="col-4 text-right">
                    € {availability.totalDeliveryOnBoard}
                  </div>
                )}
                {!availability && (
                  <div className="col-4 text-right">€ 0.00</div>
                )}
              </div>
              <div className="row mt-2">
                <div className="col-8">Shipping</div>
                {availability && (
                  <div className="col-4 text-right">
                    € {availability.totalShippingCosts}
                  </div>
                )}
                {!availability && (
                  <div className="col-4 text-right">€ 0.00</div>
                )}
              </div>
              <div className="row mt-2">
                <div className="col-8">Reallocation</div>
                {availability && (
                  <div className="col-4 text-right">
                    € {availability.totalRelocationFees}
                  </div>
                )}
                {!availability && (
                  <div className="col-4 text-right">€ 0.00</div>
                )}
              </div>
              <div className="row mt-2">
                <div className="col-8">Handeling</div>
                {availability && (
                  <div className="col-4 text-right">
                    € {availability.totalHandlingCosts}
                  </div>
                )}
                {!availability && (
                  <div className="col-4 text-right">€ 0.00</div>
                )}
              </div>
            </div>
          )}

          <div className="row mt-2">
            <div className="col-8">Total Costs</div>
            {availability && availability.grandTotalPrice && (
              <div className="col-4 text-right">
                € {Number(availability.grandTotalPrice).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <br />
        <button
          onClick={() => {
            this.props.closeModal();
            this.props.router.push("/");
          }}
          className="search-button-border"
        >
          Continue Shopping
        </button>
        <br />
        <div className="confirmationview">
          <Link href="/checkout">
            <a
              href="/checkout"
              className="search-button-full"
              style={{ textAlign: "center" }}
              onClick={(e) => {
                this.props.resetLocalSearch();
              }}
            >
              Checkout
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ rootReducer, localSearchReducer }) => {
  return {
    rootReducer,
    localSearchReducer,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withRouter(ProductBookingRentalDetails));
