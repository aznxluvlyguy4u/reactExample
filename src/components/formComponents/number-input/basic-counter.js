import React, { Component } from "react";

class BasicCounter extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: props.value };
  }

  changeValue(number) {
    let newval = parseInt(this.state.value) + parseInt(number);
    newval = newval > 0 ? newval : 0;
    this.setState({ value: newval });

    if (this.props.changeValue) {
      this.props.changeValue(newval);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }

  render() {
    const { value } = this.state;
    console.log(this.props.noZero);
    return (
      <div>
        <input id={this.props.id} name={this.props.name} type="hidden" value={value} onChange={e => this.setState({value: e.target.value})} />
        <div className="counter">
          <div onClick={() => this.changeValue(-1)} className="plus-minus">
            -
          </div>
          <div className="value">{value}</div>
          <div onClick={() => this.changeValue(1)} className="plus-minus">
            +
          </div>
        </div>
      </div>
    );
  }
}

export default BasicCounter;
