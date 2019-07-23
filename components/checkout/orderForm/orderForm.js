import Modal from 'react-modal';
import React, { Component } from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import CustomInputComponent from '../../signup/customInputComponent';
import CustomTextArea from '../../formComponents/customTextArea/customTextArea';
import OrderFormSchema from './orderFormSchema';

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

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  addressAddition: '',
  city: '',
  phonePrefix: '',
  phoneNumber: '',
  comment: '',
  country: '',
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body');

class OrderForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signup">
        <h1>Place Order</h1>
        <p>To proceed with checkout please fill in the information below</p>
        <Formik
          // validate={validate}
          validationSchema={OrderFormSchema}
          initialValues={initialValues}
          onSubmit={this.props.handleSubmit}
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
                  <Field name="streetNumber" placeholder="Street number" component={CustomInputComponent} />
                </div>
                <div className="postalCode form-block">
                  <label htmlFor="postalCode">Postal code</label>
                  <Field name="postalCode" placeholder="Postal code" component={CustomInputComponent} />
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
                <div className="country form-block">
                  <label htmlFor="country">Country</label>
                  <Field name="country" placeholder="Country" component={CustomInputComponent} />
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

              <div className="comment form-block">
                <label htmlFor="comment">General Comment</label>
                <Field name="comment" placeholder="General Comment" component={CustomTextArea} />
              </div>

              <button disabled={!!this.props.loading} className="fullwidth-button" type="submit">Place Order</button>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default OrderForm;
