import React, { Component } from 'react';

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = { }
  }

  componentDidMount() {

  }

  render() {
    return(
      <span className="counter">
        <button
          className="subtract-button"
          onClick={(e) => {
            if (this.props.quantity > 0) {
              this.props.updateQuantity({item: this.props.item, quantity: this.props.quantity - 1})
            }
          }}
        >&minus;</button>
        <span className="center">
          <span className="quantity">{this.props.quantity}</span>
          <br />
        </span>
        <button
          className="add-button"
          onClick={(e) => {
            if (this.props.quantity < this.props.item.quantityAvailable) {
              this.props.updateQuantity({item: this.props.item, quantity: this.props.quantity + 1})
            }
          }}
        >+</button>
      </span>
    )
  }
}

export default Counter;
