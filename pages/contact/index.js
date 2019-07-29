import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import PhoneNumbers from '../../components/landing-pages/phonenumbers';
import CustomSelect from '../../components/formComponents/select/customSelect';
import CustomInputComponent from '../../components/signup/customInputComponent';
import { postContactMessage } from '../../utils/rest/requests/contact';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thankYou: false,
      offices: [
        {label: 'Monaco | France', value: {id: 1, name: 'Monaco | France'}},
        {label: 'Spain', value: {id: 1, name: 'Spain'}},
        {label: 'Greece', value: {id: 1, name: 'Greece'}},
        {label: 'Italy', value: {id: 1, name: 'Italy'}},
        {label: 'ADRIATIC', value: {id: 1, name: 'ADRIATIC'}},
        {label: 'Caribbean', value: {id: 1, name: 'Caribbean'}},
      ]
    };

    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(values) {
    postContactMessage(values)
      .then(response => {
        if(response.code === 201) {
          this.setState({
            thankYou: true,
          });
        }
      });
  }

  render() {

    return (
      <Default nav="fixed" search meta={{ title: 'Detail Page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <div className="maps">
            <iframe src="https://www.google.com/maps/d/embed?mid=1uqybh4Cedy9BeWZxfU9_B606fnY" width="100%" height="100%"></iframe>
          </div>
          <div className="contact-wrapper">
            <h1>Contact Us</h1>
            <div className="col-left" style={{ padding: '0px 10px 15px 0px', boxSizing: 'border-box'}}>
              <div style={{width:'40%', float: 'left', padding: '10px 10px 10px 0px', boxSizing: 'border-box'}}>
                <img src="static/images/about/Barbara.png" width="100%"/>
              </div>
              <div style={{width:'60%', float: 'left', padding: '0px 0px 15px 10px', boxSizing: 'border-box'}}>
                <p>Feel free to contact any of our offices for any questions you have
                  <br />
                  <br />
                  We are available to help 24/7.
                </p>
                <a href="tel:+33 640 62 95 99" className="button-border">+33 640 62 95 99</a>
              </div>
            </div>
            <div className="col-right">
              {this.state.thankYou  === true ?
                <div>
                  <h3>Thank you</h3>
                  <p>We will answer your message as soon as possible</p>
                </div>
              :
              <Formik
                // validationSchema={{}}
                onSubmit={this.submitForm || undefined}
                enableReinitialize
                initialValues={{
                  name: '',
                  office: '',
                  emailAddress: '',
                  phoneNumber: '',
                  message: '',
                }}
              >
                {({
                  setFieldValue,
                  /* and other goodies */
                }) => (
                  <Form>
                    <div>
                      <div className="keyword form-block">
                        <label htmlFor="keyword">Name</label>
                        <Field
                          name="name"
                          component={CustomInputComponent} />
                      </div>
                      {/* <div className="keyword form-block">
                        <label htmlFor="office">Office</label>
                        <Field
                          placeholder="Select Office"
                          options={this.state.offices}
                          name="office"
                          setFieldValue={setFieldValue}
                          component={CustomSelect} />
                      </div> */}

                      <div style={{width: '50%', float: 'left'}} className="form-left">
                        <div className="keyword form-block">
                          <label htmlFor="emailAddress">Email</label>
                          <Field
                            name="emailAddress"
                            component={CustomInputComponent} />
                        </div>
                      </div>
                      <div style={{width: '50%', float: 'left'}} className="form-right">
                        <div className="keyword form-block">
                          <label htmlFor="phoneNumber">Phone number</label>
                          <Field
                            name="phoneNumber"
                            component={CustomInputComponent} />
                        </div>
                      </div>
                      <div className="keyword form-block">
                        <label htmlFor="message">Message</label>
                        <Field
                          validation={true}
                          name="message"
                          setFieldValue={setFieldValue}
                          component="textarea" />
                        </div>
                        <button className="search-button-full" type="submit">Submit</button>
                    </div>
                  </Form>
                )}
              </Formik>}
            </div>

            {/* <div className="col-full" style={{width:'100%', display:'block', float:'left'}}>
              <h1>Regional Help Centers</h1>
              <PhoneNumbers />
            </div> */}
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(AboutPage);
