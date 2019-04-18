import Modal from 'react-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Component} from 'react';
import './signup.scss';
import RegisterMapping from '../../utils/mapping/RegisterRequest';
import CustomInputComponent from './customInputComponent';
import countrySelectComponent from './countrySelectComponent';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow: 'scroll',
    maxHeight: '80vh',
    borderRadius: '2px'
  },
  overlay: {
    background: "rgba(25, 48, 59, 0.5)"
  }
};
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('.nav')

const validate = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = 'Please fill in an email address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors
};

function SignUp({ modalIsOpen, afterOpenModal, closeModal }) {
  function onSubmit(values) {
    console.log(values);
  }
  return ( <Modal
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
    initialValues={{
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
      phoneNumber: ''
    }}
    onSubmit={values => onSubmit(values)}
    render={({ errors, touched, validateForm, setFieldValue }) => (

      <Form>
        <div className="firstName form-block">
          <label htmlFor="firstName">Name</label>
          <Field name="firstName" placeholder="First name" component={CustomInputComponent}/>
          <ErrorMessage name="firstName" />
        </div>

        <div className="lastName form-block">
          <label htmlFor="lastName">Surname</label>
          <Field name="lastName" placeholder="Surname" component={CustomInputComponent}/>
          <ErrorMessage name="lastName" />
        </div>

        <div className="email form-block">
          <label htmlFor="email">Email Address</label>
          <Field name="email" placeholder="Email Address" component={CustomInputComponent} />
          {/* <Field className={errors.errors.email ? 'error' : ''} name="email" placeholder="Email address" type="email" /> */}
          {/* <ErrorMessage component="span" name="email" /> */}
        </div>

        <div className="password form-block">
          <label htmlFor="password">Password</label>
          <Field name="password" placeholder="Password" type="password" component={CustomInputComponent}/>
          <ErrorMessage name="password" />
        </div>

        <div className="confirmPassword form-block">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field name="confirmPassword" placeholder="Confirm Password" type="password" component={CustomInputComponent}/>
          <ErrorMessage name="confirmPassword" />
        </div>

        <div className="form-inline">
        <div className="streetName form-block">
            <label htmlFor="streetName">Street name</label>
            <Field name="streetName" placeholder="Street name" component={CustomInputComponent}/>
            <ErrorMessage name="streetName" />
        </div>
        <div className="streetNumber form-block">
            <label htmlFor="streetNumber">Street number</label>
            <Field name="streetNumber" placeholder="street Number" component={CustomInputComponent}/>
            <ErrorMessage name="streetNumber" />
        </div>
        <div className="postalCode form-block">
            <label htmlFor="postalCode">postalCode</label>
            <Field name="postalCode" placeholder="postalCode" component={CustomInputComponent}/>
            <ErrorMessage name="postalCode" />
        </div>
        </div>

        <div className="addressAddition form-block">
            <label htmlFor="addressAddition">Address Addition</label>
            <Field name="addressAddition" placeholder="Address Addition" component={CustomInputComponent}/>
            <ErrorMessage name="addressAddition" />
        </div>

        <div className="form-inline">
          <div className="city form-block">
              <label htmlFor="city">City</label>
              <Field name="city" placeholder="City" component={CustomInputComponent}/>
              <ErrorMessage name="city" />
          </div>
          <div className="country form-block">
              <label htmlFor="country">Country</label>
              <Field name="country" placeholder="Country" setFieldValue={setFieldValue} component={countrySelectComponent}/>
              <ErrorMessage name="country" />
          </div>
        </div>

        <div className="form-inline">
          <div className="phonePrefix form-block">
              <label htmlFor="phonePrefix">Prefix</label>
              <Field name="phonePrefix" placeholder="Prefix" />
              <ErrorMessage name="phonePrefix" />
          </div>
          <div className="phoneNumber form-block">
              <label htmlFor="phoneNumber">Phone number</label>
              <Field name="phoneNumber" placeholder="Phone number" />
              <ErrorMessage name="phoneNumber" />
          </div>
        </div>

        <button className="fullwidth-button" type="submit">Complete Account</button>
      </Form>
    )}
      />
      </div>
      </Modal> );
    }

export default SignUp;