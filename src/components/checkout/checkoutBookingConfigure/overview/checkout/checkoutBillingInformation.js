import React, { Component, Fragment } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomInputComponent from "../../../../formComponents/customInputComponent/customInputComponent";
import CountrySelectComponent from "../../../../formComponents/countrySelectComponent/countrySelectComponent";
import CheckoutBillingInformationFormSchema from "./checkoutBillingInformationFormSchema";

// Input feedback
const InputFeedback = ({ error }) => (error ? <span>{error}</span> : null);

const Checkbox = ({
  field: { name, value, onChange, onBlur },
  form: { errors, touched, setFieldValue },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <Fragment>
      <input
        style={{ width: "auto" }}
        name={name}
        id={id}
        type="checkbox"
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
      />{" "}
      <span style={{ color: "#000" }}>{label}</span>
      <br />
      {touched[name] && <InputFeedback error={errors[name]} />}
    </Fragment>
  );
};

class CheckoutBillingInformationForm extends Component {
  constructor(props) {
    super(props);
    let initialValues = props.cartItem.billingInformation;
    if (!initialValues) {
      initialValues = {
        firstName: "",
        surname: "",
        emailAddress: "",
        phoneNumber: "",
        company: "",
        vatNumber: "",
        streetName: "",
        streetNumber: "",
        streetNumberBlock: "",
        postalCode: "",
        country: ""
      };
    }

    this.state = { initialValues, contactInfoSelect: false };
  }

  handleSubmit(billingInformation) {
    console.log(billingInformation);
  }

  setFromContactInformation(event) {
    if (event.target.checked) {
      let initialValues = this.state.initialValues;
      initialValues.firstName = this.props.cartItem.contactInformation.firstName;
      initialValues.surname = this.props.cartItem.contactInformation.surname;
      initialValues.emailAddress = this.props.cartItem.contactInformation.emailAddress;
      initialValues.phoneNumber = this.props.cartItem.contactInformation.phoneNumber;
      this.setState(initialValues);
    }
  }

  render() {
    return (
      <div>
        <div className="form-block">
          <input
            style={{ width: "auto" }}
            name=""
            id=""
            type="checkbox"
            value={this.state.contactInfoSelect}
            onChange={this.setFromContactInformation.bind(this)}
          />
          <span style={{ color: "#000" }}>Use Contact Information</span>
          <br />
        </div>
        <Formik
          enableReinitialize
          validationSchema={CheckoutBillingInformationFormSchema}
          initialValues={this.state.initialValues}
          onSubmit={this.handleSubmit.bind(this)}
        >
          {({ errors, setFieldValue }) => (
            <Form id="billingInformation-form">
              <div className="row">
                <div className="col-6">
                  <div className="form-inline">
                    <div className="firstName form-block">
                      <label htmlFor="firstName">Name</label>
                      <Field
                        name="firstName"
                        placeholder="First name"
                        component={CustomInputComponent}
                      />
                    </div>

                    <div className="surname form-block">
                      <label htmlFor="surname">Surname</label>
                      <Field
                        name="surname"
                        placeholder="Surname"
                        component={CustomInputComponent}
                      />
                    </div>
                  </div>

                  <div className="phoneNumber form-block">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Field
                      name="phoneNumber"
                      placeholder="Phone number"
                      component={CustomInputComponent}
                    />
                  </div>

                  <div className="email form-block">
                    <label htmlFor="emailAddress">Email Address</label>
                    <Field
                      name="emailAddress"
                      placeholder="Email Address"
                      component={CustomInputComponent}
                    />
                  </div>

                  <div className="company form-block">
                    <label htmlFor="company">Company</label>
                    <Field
                      name="company"
                      placeholder="Company"
                      component={CustomInputComponent}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="vatNumber form-block">
                    <label htmlFor="emailAddress">Vat number</label>
                    <Field
                      name="vatNumber"
                      placeholder="Vat number"
                      component={CustomInputComponent}
                    />
                  </div>
                  <div className="form-inline">
                    <div className="streetName form-block">
                      <label htmlFor="streetName">Street</label>
                      <Field
                        name="streetName"
                        placeholder="streetName"
                        component={CustomInputComponent}
                      />
                    </div>
                    <div className="streetNumber form-block">
                      <label htmlFor="streetNumber">Number</label>
                      <Field
                        name="streetNumber"
                        placeholder="streetNumber"
                        component={CustomInputComponent}
                      />
                    </div>

                    <div className="streetNumberBlock form-block">
                      <label htmlFor="streetNumberBlock">Suffix</label>
                      <Field
                        name="streetNumberBlock"
                        placeholder="streetNumberBlock"
                        component={CustomInputComponent}
                      />
                    </div>
                  </div>
                  <div className="postalCode form-block">
                    <label htmlFor="postalCode">Postal Code</label>
                    <Field
                      name="postalCode"
                      placeholder="postalCode"
                      component={CustomInputComponent}
                    />
                  </div>
                  <div className="country form-block">
                    <label htmlFor={`${this.props.fieldPrefix}[country]`}>
                      Country
                    </label>
                    <Field
                      name="country"
                      placeholder="Country"
                      setFieldValue={setFieldValue}
                      component={CountrySelectComponent}
                    />
                  </div>
                </div>
              </div>

              <div className="form-block">
                <Field
                  component={Checkbox}
                  name="securityDepositConsent"
                  id="securityDepositConsent"
                  label={
                    "I understand that a Security Deposit will be charged before deliverySecurity deposit will be charged before delivery"
                  }
                />{" "}
              </div>

              <div className="form-block">
                <Field
                  component={Checkbox}
                  name="termsAndConditionsConsent"
                  id="termsAndConditionsConsent"
                  label={[
                    "I accept the ",
                    <a
                      style={{ textDecoration: "underline", color: "#00" }}
                      href="https://www.oceanpremium.com/general-terms-conditions/"
                    >
                      Terms and Conditions
                    </a>
                  ]}
                />{" "}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default CheckoutBillingInformationForm;
