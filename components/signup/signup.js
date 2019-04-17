import Modal from 'react-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Component} from 'react';
import './signup.scss';
import RegisterMapping from '../../utils/mapping/RegisterRequest';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow: 'scroll',
    maxHeight: '90vh'
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

const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div>
    <input className={touched[field.name] &&
      errors[field.name] ? 'error ' + field.name: field.name} type="text" {...field} {...props} />
    {touched[field.name] &&
      errors[field.name] && <span>{errors[field.name]}</span>}
  </div>
);

class SignUp extends Component {
  state = {  }
  onSubmit(values){
    console.log(values)
    console.log(new RegisterMapping(values).returnPostPayload())
    // validateForm().then(() => console.log('blah'))
  }
  render() {
    return ( <Modal
      isOpen={this.props.modalIsOpen}
      onAfterOpen={this.props.afterOpenModal}
      onRequestClose={this.props.closeModal}
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
    confirmPassword: ''
  }}
  onSubmit={values => this.onSubmit(values)}
  render={(errors, touched, validateForm) => (

    <Form>
      <div className="firstName form-block">
        <label htmlFor="firstName">Name</label>
        <Field name="firstName" placeholder="First name" />
        <ErrorMessage name="firstName" />
      </div>

      <div className="lastName form-block">
        <label htmlFor="lastName">Surname</label>
        <Field name="lastName" placeholder="Surname" />
        <ErrorMessage name="lastName" />
      </div>

      <div className="email form-block">
        <label htmlFor="email">Email</label>
        <Field name="email" placeholder="Email" component={CustomInputComponent} />
        {/* <Field className={errors.errors.email ? 'error' : ''} name="email" placeholder="Email address" type="email" /> */}
        {/* <ErrorMessage component="span" name="email" /> */}
      </div>

      <div className="password form-block">
        <label htmlFor="password">Password</label>
        <Field name="password" placeholder="Password" type="password" />
        <ErrorMessage name="password" />
      </div>

      <div className="confirmPassword form-block">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Field name="confirmPassword" placeholder="Confirm Password" type="password" />
        <ErrorMessage name="confirmPassword" />
      </div>

      <div className="form-inline">
      <div className="streetName form-block">
          <label htmlFor="streetName">Street name</label>
          <Field name="streetName" placeholder="Street name" />
          <ErrorMessage name="streetName" />
      </div>
      <div className="streetNumber form-block">
          <label htmlFor="streetNumber">Street number</label>
          <Field name="streetNumber" placeholder="street Number" />
          <ErrorMessage name="streetNumber" />
      </div>
      <div className="postalCode form-block">
          <label htmlFor="postalCode">postalCode</label>
          <Field name="postalCode" placeholder="postalCode" />
          <ErrorMessage name="postalCode" />
      </div>
      </div>

      <div className="addressAddition form-block">
          <label htmlFor="addressAddition">Address Addition</label>
          <Field name="addressAddition" placeholder="Address Addition" />
          <ErrorMessage name="addressAddition" />
      </div>

      <div className="form-inline">
        <div className="city form-block">
            <label htmlFor="city">City</label>
            <Field name="city" placeholder="City" />
            <ErrorMessage name="city" />
        </div>
        <div className="country form-block">
            <label htmlFor="country">Country</label>
            <Field name="country" placeholder="Country" />
            <ErrorMessage name="country" />
        </div>
      </div>

      <div className="form-inline">
        <div className="phonePrefix form-block">
            <label htmlFor="phonePrefix">Phone prefix</label>
            <Field name="phonePrefix" placeholder="Phone prefix" />
            <ErrorMessage name="phonePrefix" />
        </div>
        <div className="phoneNumber form-block">
            <label htmlFor="phoneNumber">Phone number</label>
            <Field name="phoneNumber" placeholder="Phone number" />
            <ErrorMessage name="phoneNumber" />
        </div>
      </div>

      <button className="fullwidth-button" type="submit">Next</button>
    </Form>
  )}
    />
    </div>
    </Modal> );
  }
}

export default SignUp;