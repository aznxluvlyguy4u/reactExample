import Modal from 'react-modal';
import React, { Component } from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import CustomInputComponent from '../../signup/customInputComponent';
import './orderform.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body');

class OrderForm extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(values) {
    console.log(values);
  }

  render() {
    return (
      <div className="signup">
        <h1>Place Order</h1>
        <p>To proceed with checkout please fill in the information below</p>
        <Formik
          // validate={validate}
          // validationSchema={SignupSchema}
          // initialValues={initialValues}
          onSubmit={this.handleSubmit}
          render={({
            errors, touched, validateForm, setFieldValue,
          }) => (

            <Form>
              <div className="firstName form-block">
                <label htmlFor="firstName">Name</label>
                <Field name="firstName" placeholder="First name" component={CustomInputComponent} />
              </div>

              <div className="lastName form-block">
                <label htmlFor="lastName">Surname</label>
                <Field name="lastName" placeholder="Surname" component={CustomInputComponent} />
              </div>

              <div className="email form-block">
                <label htmlFor="email">Email Address</label>
                <Field name="email" placeholder="Email Address" component={CustomInputComponent} />
              </div>

              <div className="form-inline">
                <div className="streetName form-block">
                  <label htmlFor="streetName">Street name</label>
                  <Field name="streetName" placeholder="Street name" component={CustomInputComponent} />
                </div>
                <div className="streetNumber form-block">
                  <label htmlFor="streetNumber">Street number</label>
                  <Field name="streetNumber" placeholder="street Number" component={CustomInputComponent} />
                </div>
                <div className="postalCode form-block">
                  <label htmlFor="postalCode">Postal code</label>
                  <Field name="postalCode" placeholder="postalCode" component={CustomInputComponent} />
                </div>
              </div>

              <div className="addressAddition form-block">
                <label htmlFor="addressAddition">Address Addition</label>
                <Field name="addressAddition" placeholder="Address Addition" component={CustomInputComponent} />
              </div>

              <div className="form-inline">
                <div className="city form-block">
                  <label htmlFor="city">City</label>
                  <Field name="city" placeholder="City" component={CustomInputComponent} />
                </div>
              </div>

              <div className="form-inline">
                <div className="phonePrefix form-block">
                  <label htmlFor="phonePrefix">Prefix</label>
                  <Field name="phonePrefix" placeholder="Prefix" component={CustomInputComponent} />
                </div>
                <div className="phoneNumber form-block">
                  <label htmlFor="phoneNumber">Phone number</label>
                  <Field name="phoneNumber" placeholder="Phone number" component={CustomInputComponent} />
                </div>
              </div>

              <button className="fullwidth-button" type="submit">Place Order</button>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default OrderForm;
