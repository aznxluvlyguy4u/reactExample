import Modal from 'react-modal';
import React, { Component } from 'react';
import {
  Formik, Field, Form, ErrorMessage
} from 'formik';
import CustomInputComponent from '../../formComponents/customInputComponent/customInputComponent';
import CustomTextArea from '../../formComponents/customTextArea/customTextArea';
import ContactInformationFormSchema from './contactInformationSchema';
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

class ContactInformationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {blur: false};
  }

  render() {
    const options = [
      { label: 'Charter broker / Manager', value: 'CHARTER_BROKER_OR_MANAGER' },
      { label: 'Captain / Crew', value: 'CAPTAIN_OR_CREW' },
      { label: 'Other', value: 'OTHER' },
    ];
    return (
      <div className="signup">
        <h1>Contact information</h1>
        <p>Fill in your contact details</p>
        <Formik
          enableReinitialize
          validationSchema={ContactInformationFormSchema}
          initialValues={{
            firstName: this.props.initialValues && this.props.initialValues.firstName || '',
            surName: this.props.initialValues && this.props.initialValues.surName || '',
            emailAddress: this.props.initialValues && this.props.initialValues.emailAddress || '',
            phoneNumber: this.props.initialValues && this.props.initialValues.phoneNumber || '',
            comment: this.props.initialValues && this.props.initialValues.comment || '',
            affiliation: this.props.initialValues && this.props.initialValues.affiliation || '',
            yachtname: this.props.initialValues && this.props.initialValues.yachtname || ''
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

              <div className="phoneNumber form-block">
                <label htmlFor="phoneNumber">Telephone</label>
                <Field
                  name="phoneNumber"
                  placeholder="Phone number"
                  component={CustomInputComponent} />
              </div>

              <div className="email form-block">
                <label htmlFor="emailAddress">Email Address</label>
                <Field
                  name="emailAddress"
                  placeholder="Email Address"
                  component={CustomInputComponent} />
              </div>

              <div className="affiliation form-block">
                <label htmlFor="affiliation">Your Role</label>
                <Field
                  name="affiliation"
                  placeholder="Affiliation"
                  isSearchable={false}
                  value={this.props.initialValues && this.props.initialValues.affiliation || ''}
                  // setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                  // blur={this.state.blur}
                  component={CustomSelect}
                  options={options} />
              </div>

              <div className="yachtname form-block">
                <label htmlFor="yachtname">Yacht Name</label>
                <Field
                  name="yachtname"
                  placeholder="Yacht Name"
                  component={CustomInputComponent} />
              </div>

              <div className="comment form-block">
                <label htmlFor="comment">Special Requests</label>
                <Field
                  name="comment"
                  placeholder="Comment"
                  component={CustomTextArea} />
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
                    Cancel
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

export default ContactInformationForm;
