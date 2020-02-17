import React, { Component } from "react";
import { Field } from "formik";
import CustomInputComponent from "../../../../formComponents/customInputComponent/customInputComponent";
import CountrySelectComponent from "../../../../formComponents/countrySelectComponent/countrySelectComponent";
import CustomTextArea from "../../../../formComponents/customTextArea/customTextArea";

class CheckoutLogisticsFormPart extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(values) {
    console.log("sometimes life is a ball", values);
  }

  render() {
    const {
      form,
      errors,
      field,
    } = this.props;
    return (
      <div>
        <div className="form-inline">
          <div className="streetName form-block">
            <label htmlFor={`${this.props.fieldPrefix}[streetName]`}>Street name</label>
            <Field
              name={`${this.props.fieldPrefix}[streetName]`}
              placeholder="Street name"
              component={CustomInputComponent}
            />
          </div>
          <div className="streetNumber form-block">
            <label htmlFor={`${this.props.fieldPrefix}[streetNumber]`}>Number</label>
            <Field
              name={`${this.props.fieldPrefix}[streetNumber]`}
              placeholder="Number"
              component={CustomInputComponent}
            />
          </div>
          <div className="suffix form-block">
            <label htmlFor={`${this.props.fieldPrefix}[suffix]`}>Suffix</label>
            <Field
              name={`${this.props.fieldPrefix}[suffix]`}
              placeholder="Suffix"
              component={CustomInputComponent}
            />
          </div>
        </div>
        <div className="postalCode form-block">
          <label htmlFor={`${this.props.fieldPrefix}[postalCode]`}>Postal Code</label>
          <Field
            name={`${this.props.fieldPrefix}[postalCode]`}
            placeholder="Postal Code"
            component={CustomInputComponent}
          />
        </div>
        <div className="country form-block">
          <label htmlFor={`${this.props.fieldPrefix}[country]`}>Country</label>
          <Field
            name={`${this.props.fieldPrefix}[country]`}
            placeholder="Country"
            setFieldValue={this.props.setFieldValue}
            component={CountrySelectComponent}
          />
        </div>
        <div className="comment form-block">
          <label htmlFor={`${this.props.fieldPrefix}[specialRequests]`}>Special Requests (Optional)</label>
          <Field
            name={`${this.props.fieldPrefix}[specialRequests]`}
            placeholder="Comment"
            component={CustomTextArea}
          />
        </div>
      </div>
    );
  }
}

export default CheckoutLogisticsFormPart;
