import React, { Component } from "react";
import CartUtils from "../../../utils/mapping/cart/cartUtils";
import LocalStorageUtil from "../../../utils/localStorageUtil";
import BasicCounter from "../../formComponents/number-input/basic-counter";

class CheckoutBookingConfigureGridRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartUtils: new CartUtils()
    };
  }

  returnAvailabilityIcon(item) {
    console.log(item);
    if (item.quantityAvailable === 0) {
      return <img className="availabilityImage" src="/static/images/unavailable.png" />
    }

    if (item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/unavailable.png" />
    }

    if (item.quantityAvailable !== 0 && item.quantity <= item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/available.png" />
    }
  }

  render() {
    if (this.props.rowItem) {
      return (
        <div className="row my-4">
          <div className="col-1 align-self-center">
            <a onClick={() => this.props.openModalAndSetItem()}>
              <img src="static/images/delete.png" />
            </a>
          </div>
          <div className="col-2 align-self-center">
            {this.props.rowItem.images 
            && this.props.rowItem.images.length > 0 && (
                <img
                  className="product-item"
                  src={this.props.rowItem.images[0].url}
                />
              )}
          </div>
          <div className="col-3 align-self-center">
            <h3>{this.props.rowItem.name}</h3>
            {this.props.rowItem.rates &&
              this.props.rowItem.rates.length > 0 && (
                <p className="from-price">
                  from € {this.props.rowItem.rates[0].price}
                </p>
              )}
          </div>
          <div className="col-2 align-self-center">
            <BasicCounter
              id={this.props.rowItem.index}
              name="qty"
              placeholder="Quantity"
              value={this.props.rowItem.quantity}
              changeValue={value => this.props.counterUpdate(value)}
            />
          </div>
          <div className="col-2 align-self-center">
          € {this.state.cartUtils.getItemTotal(this.props.rowItem.period, this.props.rowItem.quantity, this.props.rowItem)}
          </div>
          <div className="col-2 align-self-center text-center">
            {this.props.rowItem.stock && (this.returnAvailabilityIcon(this.props.rowItem.stock))}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigureGridRow;
