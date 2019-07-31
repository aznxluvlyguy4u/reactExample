import Modal from 'react-modal';
import React, { Component } from 'react';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import CustomInputComponent from '../../signup/customInputComponent';
import CustomTextArea from '../../formComponents/customTextArea/customTextArea';
import OrderFormSchema from './orderFormSchema';
import CustomSelect from '../../formComponents/select/customSelect';

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

class OrderForm extends Component {
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
        <h1>Place Order</h1>
        <p>To proceed with checkout please fill in the information below</p>
        <Formik
          validate
          enableReinitialize
          validationSchema={OrderFormSchema}
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            comment: '',
            affiliation: '',
            yachtname: ''
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
                  <label htmlFor="lastName">Surname</label>
                  <Field
                    name="lastName"
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
                <label htmlFor="email">Email Address</label>
                <Field
                  name="email"
                  placeholder="Email Address"
                  component={CustomInputComponent} />
              </div>

              <div className="affiliation form-block">
                <label htmlFor="affiliation">Your Role</label>
                <Field
                  name="affiliation"
                  placeholder="Affiliation"
                  isSearchable={false}
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

              <a
                className="button-border fullwidth"
                onClick={(e) => {
                  this.props.closeModal()
                }}
              >
                Cancel
              </a>
              <button disabled={!!this.props.loading} className="fullwidth-button" type="submit">Place Order</button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default OrderForm;
