import React, { Component } from "react";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";
import BasicCounter from "../../../formComponents/number-input/basic-counter";

class CheckoutBookingConfigureGridRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartUtils: new CartUtils()
    };
  }

  returnAvailabilityIcon(item) {
    if (item.availabilityState) {
      switch (item.availabilityState) {
        case 'AVAILABLE':
          return <img height="20" width="20" src="/static/images/available.png" />;
        case 'AVAILABLE_BUT_DELAYED':
          return <img height="20" width="20" src="/static/images/available.png" />;
        case 'AVAILABLE_BUT_ACCESSORY_NOT_AVAILABLE':
            return <img height="20" width="20" src="/static/images/available.png" />;
        case 'NOT_AVAILABLE':
          return <img height="20" width="20" src="/static/images/unavailable.png" />;
      }
    } else if (item.quantityAvailable === 0) {
      return <img className="availabilityImage" src="/static/images/unavailable.png" alt="unavailable" title="The product is unavialable"/>
    }

    else if (item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/alert.png" alt="unavailable" title="Quantity requested exceeds available"/>
    }

    else if (item.quantityAvailable !== 0 && item.quantity <= item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/available.png" alt="available" title="Available"/>
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
            {this.props.rowItem.item.images 
            && this.props.rowItem.item.images.length > 0 && (
                <img
                  className="product-item"
                  src={this.props.rowItem.item.images[0].url}
                />
              )}
          </div>
          <div className="col-3 align-self-center">
            <h3>{this.props.rowItem.item.name}</h3>
            {this.props.rowItem.item.note && (<p className="from-price">{this.props.rowItem.item.note}</p>)}
            {this.props.rowItem.item.rates &&
              this.props.rowItem.item.rates.length > 0 && (
                <p className="from-price">
                  from € {this.props.rowItem.item.rates[0].price}
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
          € {this.state.cartUtils.getItemTotal(this.props.rowItem.period, this.props.rowItem.quantity, this.props.rowItem.item)}
          </div>
          <div className="col-2 align-self-center text-center">
            {this.props.rowItem.itemDetails && (this.returnAvailabilityIcon(this.props.rowItem.itemDetails))}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutBookingConfigureGridRow;
