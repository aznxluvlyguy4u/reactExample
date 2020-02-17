import Modal from 'react-modal';
import React, { Component, Fragment } from 'react';
import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import CustomInputComponent from '../../formComponents/customInputComponent/customInputComponent';
import CustomTextArea from '../../formComponents/customTextArea/customTextArea';
import ContracterInformationFormSchema from './contracterInformationSchema';
import CustomSelect from '../../formComponents/select/customSelect';
import Loader from '../../loader';

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

// Input feedback
const InputFeedback = ({ error }) =>
  error ? <span>{error}</span> : null;

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
        style={{width: 'auto'}}
        name={name}
        id={id}
        type="checkbox"
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
      />{" "}
      <span style={{color: '#000'}}>{label}</span>
      <br />
      {touched[name] && <InputFeedback error={errors[name]} />}
    </Fragment>

  );
};

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phonePrefix: '',
  phoneNumber: '',
  comment: '',
  affiliation: ''
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('body');

class ContracterInformationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {blur: false};
  }

  render() {

    return (
      <div className="signup">
        <h1>Contracter information</h1>
        <p> Fill in your contracter details</p>
        <Formik
          enableReinitialize
          validationSchema={ContracterInformationFormSchema}
          initialValues={{
            firstName: this.props.initialValues && this.props.initialValues.firstName || '',
            surName: this.props.initialValues && this.props.initialValues.surName || '',
            emailAddress: this.props.initialValues && this.props.initialValues.emailAddress || '',
            company: this.props.initialValues && this.props.initialValues.company || '',
            vatNumber: this.props.initialValues && this.props.initialValues.vatNumber || '',
            streetName: this.props.initialValues && this.props.initialValues.streetName || '',
            streetNumber: this.props.initialValues && this.props.initialValues.streetNumber || '',
            streetNumberBlock: this.props.initialValues && this.props.initialValues.streetNumberBlock || '',
            postalCode: this.props.initialValues && this.props.initialValues.postalCode || '',
            country: this.props.initialValues && this.props.initialValues.country || '',
            termsAndConditionsConsent: false,
            securityDepositConsent: false
          }}

          onSubmit={this.props.handleSubmit}
        >
          {({ errors, setFieldValue }) => (
            <Form>
              <div className="form-inline">
                <div className="firstName form-block">
                  <label htmlFor="firstName">Name</label>
                  <Field
                    name="firstName"
                    placeholder="First name"
                    component={CustomInputComponent} />
                </div>

                <div className="lastName form-block">
                  <label htmlFor="surName">Surname</label>
                  <Field
                    name="surName"
                    placeholder="Surname"
                    component={CustomInputComponent} />
                </div>
              </div>

                <div className="email form-block">
                  <label htmlFor="emailAddress">Email Address</label>
                  <Field
                    name="emailAddress"
                    placeholder="Email Address"
                    component={CustomInputComponent} />
                </div>

                <div className="email form-block">
                  <label htmlFor="company">Company</label>
                  <Field
                    name="company"
                    placeholder="Company"
                    component={CustomInputComponent} />
                </div>

                <div className="vatNumber form-block">
                  <label htmlFor="emailAddress">Vat number</label>
                  <Field
                    name="vatNumber"
                    placeholder="Vat number"
                    component={CustomInputComponent} />
                </div>

                <h6>Billing information</h6>
                <div className="form-inline">
                  <div className="streetName form-block">
                    <label htmlFor="streetName">Street</label>
                    <Field
                      name="streetName"
                      placeholder="streetName"
                      component={CustomInputComponent} />
                  </div>
                  <div className="streetNumber form-block">
                    <label htmlFor="streetNumber">number</label>
                    <Field
                      name="streetNumber"
                      placeholder="streetNumber"
                      component={CustomInputComponent} />
                  </div>

                  <div className="streetNumberBlock form-block">
                    <label htmlFor="streetNumberBlock">Suffix</label>
                    <Field
                      name="streetNumberBlock"
                      placeholder="streetNumberBlock"
                      component={CustomInputComponent} />
                  </div>
                </div>
                <div className="lastName form-block">
                  <label htmlFor="postalCode">Postal Code</label>
                  <Field
                    name="postalCode"
                    placeholder="postalCode"
                    component={CustomInputComponent} />
                </div>
                <div className="lastName form-block">
                  <label htmlFor="zipCode">Country</label>
                  <Field
                    name="country"
                    placeholder="country"
                    component={CustomInputComponent} />
                </div>
                <div className="form-block">
                    <Field
                      component={Checkbox}
                      name="securityDepositConsent"
                      id="securityDepositConsent"
                      label={'Security deposit will be charged before delivery'}
                    />
                    {" "}
                </div>

                <div className="form-block">
                    <Field
                      component={Checkbox}
                      name="termsAndConditionsConsent"
                      id="termsAndConditionsConsent"
                      label={['I accept ', <a style={{textDecoration: "underline", color: "#00"}} href="https://www.oceanpremium.com/general-terms-conditions/">Terms and conditions</a>]}
                    />
                    {" "}
                </div>
              {this.props.loading === false ?
                <span>
                  <a
                    disabled={!!this.props.loading}
                    className="button-border fullwidth"
                    onClick={(e) => {
                      this.props.cancel()
                    }}
                    >
                    Back
                  </a>
                  <button disabled={!!this.props.loading} className="fullwidth-button" type="submit">Next</button>
                </span>
                :
                <Loader />
              }
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default ContracterInformationForm;
