import React, { Component } from "react";
import moment from "moment";
import { Formik, Form, Field } from "formik";
import CustomInputComponent from "../../../../formComponents/customInputComponent/customInputComponent";
import CountrySelectComponent from "../../../../formComponents/countrySelectComponent/countrySelectComponent";
import CustomTextArea from "../../../../formComponents/customTextArea/customTextArea";
import CheckoutLogisticsFormPart from "./checkoutLogisticsFormPart";
import CheckoutLogisticsFormSchema from "./checkoutLogisticsFormSchema";

class CheckoutLogistics extends Component {
  constructor(props) {
    super(props);

    let initialValues = props.cartItem.logistics;

    if (!initialValues) {
      initialValues = {
        pickUp: {
          streetName: "",
          streetNumber: "",
          suffix: "",
          postalCode: "",
          country: "",
          specialRequests: ""
        },
        dropOff: {
          streetName: "",
          streetNumber: "",
          suffix: "",
          postalCode: "",
          country: "",
          specialRequests: ""
        },
      };
    }

    this.state = { initialValues };
  }

  handleSubmit(logistics) {
    let cartItem = this.props.cartItem;
    cartItem.logistics = logistics;
    this.props.updateCartItemLogistics(cartItem);
  }

  render() {
    if (this.props.cartItem && this.state && this.state.initialValues) {
      return (
        <div className="checkout-logistics">
          <Formik
            enableReinitialize
            validationSchema={CheckoutLogisticsFormSchema}
            initialValues={this.state.initialValues}
            onSubmit={this.handleSubmit.bind(this)}
            render={({ errors, touched, validateForm, setFieldValue }) => (
              <Form id="logistics-form">
                <div className="row">
                  <div className="col-6">
                    <div className="logistics-header">
                      <h2>Pick-Up</h2>
                      {this.props.cartItem.location.collection.name} -{" "}
                      {moment(this.props.cartItem.period.start).format(
                        "DD.MM.YYYY"
                      )}
                      <CheckoutLogisticsFormPart
                        fieldPrefix="pickUp"
                        setFieldValue={setFieldValue}
                        errors={errors}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="logistics-header">
                      <h2>Drop-Off</h2>
                      {this.props.cartItem.location.delivery.name} -{" "}
                      {moment(this.props.cartItem.period.end).format(
                        "DD.MM.YYYY"
                      )}
                    </div>
                    <CheckoutLogisticsFormPart
                      fieldPrefix="dropOff"
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </div>
              </Form>
            )}
          />
        </div>
      );
    }
    return null;
  }
}

export default CheckoutLogistics;
