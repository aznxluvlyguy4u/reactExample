import React, { Component } from "react";

class NumberInput extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: props.value };
  }

  componentDidMount() {
    const { selectRef } = this.props;
    if (selectRef) selectRef(this);
  }

  componentWillUnmount() {
   const { selectRef } = this.props;
   if (selectRef) selectRef(undefined);
  }

  changeValue(number) {
    let newval = parseInt(this.state.value) + parseInt(number);
    newval = newval > 0 ? newval : 0;
    this.setState({ value: newval });

    if (this.props.changeValue) {
      this.props.changeValue(newval);
    }
  }

  updateStateValue(value) {
    this.setState({value});
  }

  render() {
    const {
      form,
      field,
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <input id={field.name} name={field.name} type="hidden" value={value} onChange={e => this.setState({value: e.target.value})} />
        <div className="counter mt-3">
          <div onClick={() => this.changeValue(-1)} className="plus-minus">
            -
          </div>
          <div className="value">{value}</div>
          <div onClick={() => this.changeValue(1)} className="plus-minus">
            +
          </div>
        </div>
        <br />
        <div
          className={
            form.touched[field.name] && form.errors[field.name]
              ? "error selectfield"
              : "selectfield"
          }
        >
          {form.touched[field.name] && form.errors[field.name] && (
            <span className="validation">{form.errors[field.name]}</span>
          )}
        </div>
      </div>
    );
  }
}

export default NumberInput;
