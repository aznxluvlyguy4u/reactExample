import React, { Component, Fragment } from "react";
import { isEmpty } from "lodash";
import Link from "next/link";
import moment from "moment";
import { connect } from "react-redux";
import rootReducer from "../../reducers/rootReducer";
import LocalStorageUtil from "../../utils/localStorageUtil";

class ProductBookingRentalDetails extends Component {
  constructor(props) {
    super(props);
    const cart = LocalStorageUtil.getCart() || [];
    const cartItem = cart[props.cartItemIndex];
    const start = moment(cart[props.cartItemIndex].period.start).endOf("day");
    const end = moment(cart[props.cartItemIndex].period.end).endOf("day");
    const dayCount = end.diff(start, "days");
    const cartItemProductIndex = cartItem.products.findIndex(
      p => p.id === props.product.id
    );
    const cartItemProduct = cartItem.products[cartItemProductIndex];
    const accessories = cartItemProduct.accessories.filter(x => x.quantity > 0);

    let rentalFee =
      Number(props.product.rates[0].price) *
      parseInt(cartItemProduct.quantity) *
      dayCount;
    accessories.map(item => {
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
      rentalFee
    };
  }

  render() {
    return (
      <div>
        <div className="form rental-details">
          <h3 className="main-title">Rental Details</h3>
          <div className="row">
            <div className="col-4">
              <strong>Rental Period</strong>
            </div>
            <div className="col-8">
              {this.state.dayCount > 1
                ? `${this.state.dayCount} days`
                : `${this.state.dayCount} day`}
            </div>
          </div>
          <div className="row">
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
          <div className="row">
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
          <div className="row">
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
              {this.state.accessories.map(accessory => (
                <div key={accessory.id}>
                  {accessory.quantity} x {accessory.name}
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <strong>Notes</strong>
            </div>
            <div className="col-8">
              A security deposit will be charged before picking up your order.
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <hr className="page-divide" />
            </div>
          </div>
          <div className="row">
            <div className="col-8">Rental Fee</div>
            <div className="col-4 text-right">€ {this.state.rentalFee}</div>
          </div>
          <div className="row">
            <div className="col-8">
              <img
                src="static/images/down.png"
                style={{ width: "10px", height: "10px", marginRight: "5px" }}
              />
              Transport Costs
            </div>
            <div className="col-4 text-right">TBD</div>
          </div>
          <div className="row">
            <div className="col-8">Total Costs</div>
            <div className="col-4 text-right">TBD</div>
          </div>
        </div>

        <br />
        <button
          onClick={() => this.props.closeModal()}
          class="search-button-border"
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
              onClick={e => {
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
    localSearchReducer
  };
};

export default connect(mapStateToProps, {})(ProductBookingRentalDetails);
