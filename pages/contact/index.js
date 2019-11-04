import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import CustomInputComponent from '../../components/signup/customInputComponent';
import { postContactMessage } from '../../utils/rest/requests/contact';
import * as Yup from 'yup';
import Loader from '../../components/loader';

const ContactFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  emailAddress: Yup.string()
    .email('Invalid email')
    .required('This is a required field'),
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
  message: Yup.string()
    .min(2, 'Too short!')
    .required('This is a required field'),
});

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
      ],
      loading: false,
    };
    this.submitForm = this.submitForm.bind(this)
  }

  submitForm(values) {
    this.setState({
      loading: true
    })
    postContactMessage(values)
      .then(response => {
        if(response.code === 201) {
          this.setState({
            thankYou: true,
            loading: false
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
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h1 className="main-title">Contact Us</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-7 col-lg-7 col-sm-12">
                <div className="row">
                  <div className="col-md-4">
                    <img width="100%" alt="Contact" src="static/images/about/Barbara.png" />
                  </div>
                  <div className="col-md-8">
                    <p>
                      Feel free to contact any of our offices for any questions you have
                      <br />
                      <br />
                      We are available to help 24/7.
                    </p>
                    <a href="tel:+33 640 62 95 99" className="button-border">+33 640 62 95 99</a>
                  </div>
                </div>]
              </div>

              <div className="col-md-5 col-lg-5 col-sm-12">
                {this.state.thankYou === true ?
                  <div>
                    <h3>Thank you</h3>
                    <p>We will answer your message as soon as possible</p>
                  </div>
                :
                <Formik
                  validationSchema={ContactFormSchema}
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
                  }) => (
                    <Form>
                      <div>
                        <div className="keyword form-block">
                          <label htmlFor="keyword">Name</label>
                          <Field
                            name="name"
                            component={CustomInputComponent} />
                        </div>

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
                          <button disabled={this.state.loading === true} className="search-button-full" type="submit">Submit</button>
                      </div>
                    </Form>
                  )}
                </Formik>}

                {this.state.loading ? <Loader /> : null}

              </div>
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(AboutPage);
