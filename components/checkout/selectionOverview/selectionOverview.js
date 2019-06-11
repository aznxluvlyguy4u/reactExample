import React, { Component } from 'react';
import './selectionoverview.scss';

class SelectionOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { totalPrice: 0 };
  }

  componentDidMount() {
    // const price = 0;
    // this.props.cart.map((item) => {
    //   console.log(item.totalPrice);
    //   price += Number(item.totalPrice);
    //   if (item.accessories) {
    //     item.accessories.map(item => price += Number(item.totalPrice));
    //   }
    // });
    // this.setState({ totalPrice: price });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cart !== this.props.cart) {
      this.setPrice();
    }
  }

  setPrice() {
    let price = 0;
    this.props.cart.map((item) => {
      console.log(item.totalPrice);
      price += Number(item.totalPrice);
      if (item.accessories) {
        item.accessories.map(item => price += Number(item.totalPrice));
      }
    });
    this.setState({ totalPrice: price });
  }

  render() {
    console.log(this.props.cart);
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
                {`€${this.state.totalPrice}`}
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
              <div className="second bold">{`€${this.state.totalPrice}`}</div>
            </div>
          </div>
        </div>
      );
    } return null;
  }
}

export default SelectionOverview;
