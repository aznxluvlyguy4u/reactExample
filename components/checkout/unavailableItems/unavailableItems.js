import React, { Component } from 'react';
import UnavailableItem from '../unavailableItem/unavailableItem';

class UnavailableItems extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="final-checkout">
        <h2>Currently unavailable items</h2>
        <span>The following items are currently not available for for the exact dates and/or locations that were selected</span>
        <div className="header-row">
          <div className="sub-item">Product</div>
          <div className="sub-item">Quantity</div>
          <div className="sub-item">Price</div>
          <div className="sub-item">Delivery</div>
          <div className="sub-item">Collection</div>
          <div className="sub-item">Availability</div>
          <div className="sub-item">Details</div>
        </div>
        {this.props.cart.map(item => <UnavailableItem removeItem={this.props.removeItem} data={item} />)}
      </div>
    );
  }
}

export default UnavailableItems;
