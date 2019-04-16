import Modal from 'react-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Component} from 'react';
import './signup.scss';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
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
      errors[field.name] ? 'error': ''} type="text" {...field} {...props} />
    {touched[field.name] &&
      errors[field.name] && <span>{errors[field.name]}</span>}
  </div>
);

class SignUp extends Component {
  state = {  }
  onSubmit(values, validateForm){
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
  onSubmit={values => this.onSubmit()}
  render={(errors, touched, validateForm) => (

    <Form>
      <div className="form-block">
        <label htmlFor="firstName">Name</label>
        <Field name="firstName" placeholder="First name" />
        <ErrorMessage name="firstName" />
      </div>
      {console.log(errors.errors.email)}

      <div className="form-block">
        <label htmlFor="lastName">Surname</label>
        <Field className={errors.lastName ? 'error' : ''} name="lastName" placeholder="Surname" />
        <ErrorMessage name="lastName" />
      </div>

      <div className="form-block">
        <label htmlFor="email">Email</label>
        <Field name="email" component={CustomInputComponent} />
        {/* <Field className={errors.errors.email ? 'error' : ''} name="email" placeholder="Email address" type="email" /> */}
        {/* <ErrorMessage component="span" name="email" /> */}
      </div>

      <div className="form-block">
        <label htmlFor="password">Password</label>
        <Field className={errors.password ? 'error' : ''} name="password" placeholder="Password" type="password" />
        <ErrorMessage name="password" />
      </div>

      <div className="form-block">
      <label htmlFor="confirmPassword">Confirm Password</label>
      <Field className={errors.confirmPassword ? 'error' : ''} name="confirmPassword" placeholder="Confirm Password" type="password" />
      <ErrorMessage name="confirmPassword" />
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