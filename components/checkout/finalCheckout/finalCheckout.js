import React, { Component } from 'react';
import './finalcheckout.scss';
import CheckoutItem from '../checkoutItem/checkoutItem';

class FinalCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="final-checkout">
        <h2>Final Checkout</h2>
        <div className="header-row">
          <div className="sub-item">Product</div>
          <div className="sub-item">Quantity</div>
          <div className="sub-item">Price</div>
          <div className="sub-item">Delivery</div>
          <div className="sub-item">Collection</div>
          <div className="sub-item">Availability</div>
          <div className="sub-item">Details</div>
        </div>
        {this.props.cart.map(item => <CheckoutItem removeItem={this.props.removeItem} data={item} />)}
      </div>
    );
  }
}

export default FinalCheckout;
