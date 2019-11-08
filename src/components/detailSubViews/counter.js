import React, { Component } from 'react';

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = { }
  }

  componentDidMount() {

  }

  isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  render() {
    return(
      <span className="counter">
        <button
          className="subtract-button"
          onClick={(e) => {
            if (this.props.quantity > 0) {
              this.props.updateQuantity({item: this.props.item, quantity: this.props.quantity - 1})
              if(this.isFunction(this.props.isClicked)) {
                this.props.isClicked(this.props.item)
              }
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
              if(this.isFunction(this.props.isClicked)) {
                this.props.isClicked(this.props.item)
              }            }
          }}
        >+</button>
      </span>
    )
  }
}

export default Counter;
