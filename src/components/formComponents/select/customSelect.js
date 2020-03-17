import React, { Component } from 'react';
import Select from 'react-select';

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    fontSize: '11px',
    color: '#D3D3D3',
    borderRadius: '3px',
    border: 'solid 1px #D3D3D3',
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
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { selectRef } = this.props;
    if (selectRef) selectRef(this);
  }

  componentWillUnmount() {
   const { selectRef } = this.props;
   if (selectRef) selectRef(undefined);
  }

  updateStateValue(value) {
    const { setFieldValue, field, options } = this.props;
    const valueToSet = value ? options.find(x => x.id === value.id) : null;
    setFieldValue(field.name, valueToSet);
    this.setState({value: valueToSet});
  }
  
  onChange(value) {
    //set the value to null for empty option
    value = value.id === null ? null : value;
    
    const { setFieldValue, field, onChange } = this.props;
    setFieldValue(field.name, value);
    this.setDropdownValue(value);

    if(value !== null) {
      const obj = {};
      obj[field.name] = value.value;
      if (onChange) {
        onChange(obj);
      }

      if(this.props.onSelect){ 
        this.props.onSelect(value);
      }
    } else {
      const obj = {};
      obj[field.name] = null;
      onChange(obj);

      if(this.props.onSelect){ 
        this.props.onSelect(null);
      }
    }
  }

  async setDropdownValue(value) {
    await this.setState({ value });
  }

  render() {
    const {
      form, field, options, placeholder, isSearchable
    } = this.props;
    const { value } = this.state;
    return (
      <div className={form.touched[field.name]
              && form.errors[field.name] ? 'error selectfield' : 'selectfield'}
      >
        <Select
          styles={colourStyles}
          onChange={this.onChange}
          options={options}
          value={value}
          placeholder={placeholder || 'Default'}
          isSearchable={isSearchable !== false}
        >
          {form.touched[field.name]
        && form.errors[field.name] && <span>{form.errors[field.name]}</span>}
          <input name={field.name} type="hidden" value={value} />
        </Select>
        {form.touched[field.name]
      && form.errors[field.name] && <span className="validation">{form.errors[field.name]}</span>}
      </div>
    );
  }
}

export default CustomSelect;
