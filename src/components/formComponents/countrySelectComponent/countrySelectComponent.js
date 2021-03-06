import React, { useState } from "react";
import Select from "react-select";
import { continents, countries, languages, languagesAll } from "countries-list";
import { transformCountryData } from "../../../utils/data/countryDataUtil";

const options = transformCountryData(countries);

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    fontSize: "11px",
    color: "#D3D3D3",
    borderRadius: "0px",
    border: "solid 1px #D3D3D3",
    paddingTop: "4px",
    paddingBottom: "4px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "solid transparent 2px"
    }
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: "white",
    color: "#19303B",
    cursor: isDisabled ? "not-allowed" : "default",
    fontSize: "11px",
    fontWeight: "bold",
    width: "100%"
  }),
  menu: styles => ({ ...styles, borderRadius: "0px" }),
  placeholder: styles => ({ ...styles, color: "#D3D3D3" }),
  singleValue: styles => ({ ...styles, color: "#19303B" }),
  noOptionsMessage: styles => ({
    ...styles,
    color: "#D3D3D3",
    fontSize: "11px"
  }),
  input: styles => ({ ...styles, color: "#19303B", fontSize: "11px" })
};

function CountrySelectComponent({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  setFieldValue, // Setting field value with Formik
  ...props
}) {
  const [dropdownValue, setDropdownValue] = useState(field.value);

  function onChange(value) {
    if (typeof setFieldValue === "function")
      setFieldValue(field.name, value.value);
    if (typeof setFieldValue === "function")
      setFieldValue("phonePrefix", `+${value.phone}`);
    setDropdownValue(value);
  }

  return field.name.indexOf("[") === -1 ? (
    <>
      <Select
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null
        }}
        className={touched[field.name] && errors[field.name] ? "error" : ""}
        styles={colourStyles}
        onChange={onChange}
        options={options}
        value={
          dropdownValue &&
          dropdownValue.value
            ? options.filter(option => option.value === dropdownValue.value)
            : dropdownValue
            ? options.filter(option => option.value === dropdownValue)
            : dropdownValue
        }
      />
      {touched[field.name] && errors[field.name] && (
        <span>{errors[field.name]}</span>
      )}
      <input
        name={field.name}
        type="hidden"
        value={dropdownValue && dropdownValue.value ? dropdownValue.value : dropdownValue}
      />
    </>
  ) : (
    <>
      <Select
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null
        }}
        styles={colourStyles}
        className={(touched[field.name.substr(0, field.name.indexOf("["))] &&
        touched[field.name.substr(0, field.name.indexOf("["))][
          field.name.substring(
            field.name.indexOf("[") + 1,
            field.name.indexOf("]")
          )
        ] &&
        errors[field.name.substr(0, field.name.indexOf("["))] &&
        errors[field.name.substr(0, field.name.indexOf("["))][
          field.name.substring(
            field.name.indexOf("[") + 1,
            field.name.indexOf("]")
          )
        ]) ? "error" : ""}
        onChange={onChange}
        options={options}
        value={
          dropdownValue &&
          dropdownValue.value
            ? options.filter(option => option.value === dropdownValue.value)
            : dropdownValue
            ? options.filter(option => option.value === dropdownValue)
            : dropdownValue
        }
      />
      {touched[field.name.substr(0, field.name.indexOf("["))] &&
        touched[field.name.substr(0, field.name.indexOf("["))][
          field.name.substring(
            field.name.indexOf("[") + 1,
            field.name.indexOf("]")
          )
        ] &&
        errors[field.name.substr(0, field.name.indexOf("["))] &&
        errors[field.name.substr(0, field.name.indexOf("["))][
          field.name.substring(
            field.name.indexOf("[") + 1,
            field.name.indexOf("]")
          )
        ] && (
          <span>
            {
              errors[field.name.substr(0, field.name.indexOf("["))][
                field.name.substring(
                  field.name.indexOf("[") + 1,
                  field.name.indexOf("]")
                )
              ]
            }
          </span>
        )}
      <input
        name={field.name}
        type="hidden"
        value={dropdownValue && dropdownValue.value ? dropdownValue.value : dropdownValue}
      />
    </>
  );
}

export default CountrySelectComponent;
