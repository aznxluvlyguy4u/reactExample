import React, { Component } from "react";

class NumberInput extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: this.props.value };
  }

  changeValue(number) {
    let newval = parseInt(this.state.value) + parseInt(number);
    newval = newval > 0 ? newval : 0;
    this.setState({ value: newval });

    if (this.props.changeValue) { 
      this.props.changeValue(newval);
    }
  }

  render() {
    return (
      <div className="counter mt-3">
        <div onClick={() => this.changeValue(-1)} className="plus-minus">
          -
        </div>
        <div className="value">{this.state.value}</div>
        <div onClick={() => this.changeValue(1)} className="plus-minus">
          +
        </div>
      </div>
    );
  }
}

export default NumberInput;
