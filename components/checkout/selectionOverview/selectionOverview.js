import React, { Component } from 'react';

class SelectionOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    if (this.props.cart) {
      return (
        <div className="paragraph-wrapper selection-overview">
          <h2>Selection Overview</h2>
          <div className="paragraph">
            <h3>
Final checkout items
              <img height="10" width="10" src="/static/images/available.png" />
            </h3>
            <div className="content-wrapper">
              <div className="first">{`${this.props.cart.length} items`}</div>
              <div className="second">
                {`€${this.props.totalPrice ? this.props.totalPrice : 0.00}`}
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
              <div className="second bold">{`€${this.props.totalPrice ? this.props.totalPrice : 0.00}`}</div>
            </div>
          </div>
        </div>
      );
    } return null;
  }
}

export default SelectionOverview;
