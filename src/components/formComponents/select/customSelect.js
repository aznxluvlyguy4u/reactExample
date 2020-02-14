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
    // Don't call this.setState() here!
    this.state = { value: this.props.value };
    this.onChange = this.onChange.bind(this);
  }

  
  onChange(value) {
    const { setFieldValue, field, onChange } = this.props;
    setFieldValue(field.name, value);
    this.setDropdownValue(value);
    const obj = {};
    obj[field.name] = value.value;
    if (onChange) {
      onChange(obj);
    }

    if(this.props.onSelect){ 
      this.props.onSelect(value);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== '' && nextProps.value !== undefined && this.state.value.id !== nextProps.value.id) {
      const { setFieldValue, field } = this.props;
      setFieldValue(field.name, nextProps.value);
      this.setDropdownValue(nextProps.value);
    }
  }

  setDropdownValue(value) {
    this.setState({ value });
  }

  render() {
    const {
      form, field, options, placeholder, isSearchable, arrow,
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
