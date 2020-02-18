import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import CustomInputComponent from "../../../../formComponents/customInputComponent/customInputComponent";
import CustomTextArea from "../../../../formComponents/customTextArea/customTextArea";
import CheckoutContactInformationFormSchema from "./checkoutContactInformationFormSchema";
import CustomSelect from "../../../../formComponents/select/customSelect";

class CheckoutContactInformationForm extends Component {
  constructor(props) {
    super(props);
    let initialValues = props.cartItem.contactInformation;
    if (!initialValues) {
      initialValues = {
        firstName: "",
        surname: "",
        emailAddress: "",
        phoneNumber: "",
        comment: "",
        affiliation: ""
      };
    }

    this.state = { initialValues };
  }

  handleSubmit(contactInformation) {
    let cartItem = this.props.cartItem;
    cartItem.contactInformation = contactInformation;
    this.props.updateCartItemContactInformation(cartItem);
  }

  render() {
    const options = [
      { label: "Charter broker / Manager", value: "CHARTER_BROKER_OR_MANAGER" },
      { label: "Captain / Crew", value: "CAPTAIN_OR_CREW" },
      { label: "Other", value: "OTHER" }
    ];
    return (
      <div className="contact-information">
        <Formik
          enableReinitialize
          validationSchema={CheckoutContactInformationFormSchema}
          initialValues={this.state.initialValues}
          onSubmit={this.handleSubmit.bind(this)}
        >
          {({ errors, setFieldValue }) => (
            <Form id="contactInformation-form">
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

                  <div className="emailAddress form-block">
                    <label htmlFor="emailAddress">Email Address</label>
                    <Field
                      name="emailAddress"
                      placeholder="Email Address"
                      component={CustomInputComponent}
                    />
                    <div className="affiliation form-block">
                      <label htmlFor="affiliation">Role</label>
                      <Field
                        name="affiliation"
                        placeholder="Affiliation"
                        isSearchable={false}
                        value={
                          (this.state.initialValues &&
                            this.state.initialValues.affiliation) ||
                          ""
                        }
                        setFieldValue={setFieldValue}
                        component={CustomSelect}
                        options={options}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="yachtname form-block">
                    <label htmlFor="yachtname">
                      Yacht Name <span className="optional">(Optional)</span>
                    </label>
                    <Field
                      name="yachtname"
                      placeholder="Yacht Name"
                      component={CustomInputComponent}
                    />
                  </div>

                  <div className="comment form-block">
                    <label htmlFor="comment">
                      Special Requests{" "}
                      <span className="optional">(Optional)</span>
                    </label>
                    <Field
                      name="comment"
                      placeholder="Comment"
                      component={CustomTextArea}
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default CheckoutContactInformationForm;
