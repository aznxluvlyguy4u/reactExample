import Modal from 'react-modal';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import { Component } from 'react';
import { toast } from 'react-toastify';
import CustomInputComponent from '../formComponents/customInputComponent/customInputComponent';
import countrySelectComponent from '../formComponents/countrySelectComponent/countrySelectComponent';
import validate from './signupValidation';
import SignupSchema from './signupSchema';
import { registerUser } from '../../utils/rest/requests/authRest';
import RegisterError from '../../utils/mapping/RegisterError';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'scroll',
    maxHeight: '80vh',
    borderRadius: '2px',
  },
  overlay: {
    background: 'rgba(25, 48, 59, 0.5)',
  },
};
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('.nav');

const testValues = {
  addressAddition: 'sdfsddsf',
  city: 'sdfsdf',
  confirmPassword: 'Test1234&',
  country: '{"name":"Albania","alpha2Code":"AL","callingCode":"355"}',
  email: 'sdfsd@dsfsd.te',
  firstName: 'sdfsdf',
  lastName: 'sdfsdf',
  password: 'Test1234&',
  phoneNumber: '34534',
  phonePrefix: '+355',
  postalCode: '435345',
  streetName: 'sdfsdf',
  streetNumber: '34',
};

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  streetName: '',
  streetNumber: '',
  postalCode: '',
  addressAddition: '',
  city: '',
  country: '',
  phonePrefix: '',
  phoneNumber: '',
};
function SignUp({ modalIsOpen, afterOpenModal, closeModal }) {
  async function onSubmit(values, bag) {
    try {
      await registerUser(values);
      toast.success('Success');
    } catch (error) {
      bag.setSubmitting(false);
      if (error.statusCode === 403) {
        bag.setErrors({ email: error.status });
        return;
      }
      if (error.statusCode === 400) {
        bag.setErrors(new RegisterError(error.message).returnResponsePayload());
        return;
      }
      handleGeneralError(error);
    }
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className="signup">
        <h1>Sign Up</h1>
        <p>To proceed with checkout</p>
        <Formik
          validate={validate}
          validationSchema={SignupSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
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

              <div className="password form-block">
                <label htmlFor="password">Password</label>
                <Field name="password" placeholder="Password" type="password" component={CustomInputComponent} />
              </div>

              <div className="confirmPassword form-block">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field name="confirmPassword" placeholder="Confirm Password" type="password" component={CustomInputComponent} />
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
                <div className="country form-block">
                  <label htmlFor="country">Country</label>
                  <Field name="country" placeholder="Country" setFieldValue={setFieldValue} component={countrySelectComponent} />
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

              <button className="fullwidth-button" type="submit">Complete Account</button>
            </Form>
          )}
        />
      </div>
    </Modal>
  );
}

export default SignUp;
