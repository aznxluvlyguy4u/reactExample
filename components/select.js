import React, { useState } from 'react';
import Select from 'react-select';

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

function CustomSelect({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  setFieldValue, // Setting field value with Formik
  ...props
}) {
  const [dropdownValue, setDropdownValue] = useState(field.value);

  function onChange(value) {
    setFieldValue.setFieldValue(field.name, JSON.parse(value.value));
    setDropdownValue(value);
  }

  return (

    <>
      <Select
        components={
    {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
    }
  }
        styles={colourStyles}
        onChange={onChange}
        options={props.options}
      />
      {touched[field.name]
      && errors[field.name] && <span>{errors[field.name]}</span>}
      <input name={field.name} type="hidden" value={dropdownValue.value ? dropdownValue.value : dropdownValue} />
    </>
  );
}

export default CustomSelect;
