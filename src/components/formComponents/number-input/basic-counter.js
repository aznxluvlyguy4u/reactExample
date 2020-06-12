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
    
    return (
      <div>
        <input id={this.props.id} name={this.props.name} type="hidden" value={value} onChange={e => this.setState({value: e.target.value})} />
        <div className="counter">
          <button disabled={this.props.noZero && value === 1} onClick={() => this.changeValue(-1)} className={`plus-minus ${(this.props.noZero && value === 1) ? 'disabled': ''}`}>
            -
          </button>
          <div className="value">{value}</div>
          <button onClick={() => this.changeValue(1)} className="plus-minus">
            +
          </button>
        </div>
      </div>
    );
  }
}

export default BasicCounter;
