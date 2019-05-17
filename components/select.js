import React, { useState, Component } from 'react';
import Select from 'react-select';
import './select.scss';

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    fontSize: '11px',
    color: '#D3D3D3',
    borderRadius: '3px',
    border: 'solid 2px #D3D3D3',
    paddingTop: '4px',
    paddingBottom: '4px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'solid transparent 2px',
    },
  }),
  option: (styles, {
    data, isDisabled, isFocused, isSelected,
  }) => ({
    ...styles,
    backgroundColor: 'white',
    color: '#19303B',
    cursor: isDisabled ? 'not-allowed' : 'default',
    fontSize: '11px',
    fontWeight: 'bold',
    width: '100%',
  }),
  menu: styles => ({ ...styles, borderRadius: '0px' }),
  placeholder: styles => ({ ...styles, color: '#D3D3D3' }),
  singleValue: styles => ({ ...styles, color: '#19303B' }),
  noOptionsMessage: styles => ({ ...styles, color: '#D3D3D3', fontSize: '11px' }),
  input: styles => ({ ...styles, color: '#19303B', fontSize: '11px' }),
};

class CustomSelect extends Component {
  // function CustomSelect({
  //   field, // { name, value, onChange, onBlur }
  //   form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  //   setFieldValue, // Setting field value with Formik
  //   ...props
  // }) {
  // const [dropdownValue, setDropdownValue] = useState(field.value);
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { value: undefined };
    this.onChange = this.onChange.bind(this);
  }

  setDropdownValue(value) {
    this.setState({ value });
  }

  onChange(value) {
    console.log(value);
    this.props.setFieldValue.setFieldValue(this.props.field.name, value);
    this.setDropdownValue(value);
    // props.onChange();
  }

  render() {
    return (
      <Select
        styles={colourStyles}
        onChange={this.onChange}
        options={this.props.options}
        value={this.state.value ? this.state.value : this.props.value}
      >
        {this.props.form.touched[this.props.field.name]
        && this.props.form.errors[this.props.field.name] && <span>{this.props.form.errors[this.props.field.name]}</span>}
        {/* <input name={this.props.field.name} type="hidden" value={this.state.value} /> */}
      </Select>
    );
  }
}

export default CustomSelect;
