import React, { Component } from "react";
import { Field, Form, Formik } from "formik";
import { connect } from "react-redux";
import { scroller } from "react-scroll";
import * as Yup from "yup";
import classnames from "classnames";
import Default from "../../layouts/default";
import rootReducer from "../../reducers/rootReducer";
import CustomInputComponent from "../../components/signup/customInputComponent";
import { postContactMessage } from "../../utils/rest/requests/contact";
import Loader from "../../components/loader";
import Accordion from "../../components/accordion/accordion";

const ContactFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("This is a required field"),
  emailAddress: Yup.string()
    .email("Invalid email")
    .required("This is a required field"),
  phoneNumber: Yup.number()
    .min(2, "Too Short!")
    .required("This is a required field"),
  message: Yup.string()
    .min(2, "Too short!")
    .required("This is a required field"),
  enquiryType: Yup.string().required("Please select enquiry type")
});

// Radio input
const RadioButton = ({
  field: { name, value, onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div className="outerwrapper">
      <div className="innerwrapper">
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          className={classnames("radio-button")}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
};

// Radio group
const RadioButtonGroup = ({
  value,
  error,
  touched,
  id,
  label,
  className,
  children
}) => {
  const classes = classnames(
    "rad-input-field",
    {
      "is-success": value || (!error && touched), // handle prefilled or user-filled
      "is-error": !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
      {children}
      {touched && <InputFeedback error={error} />}
      <legend>{label}</legend>
    </div>
  );
};

class ContactPage extends Component {
  constructor(props) {
    super(props);

    this.faqs = [
      {
        title: "Question 1",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus senectus nunc, ac arcu, egestas quisque lectus et lorem. Commodo neque urna, pellentesque ante dui ut enim turpis quam. Non nulla enim tristique tellus. Neque elementum morbi etiam proin sapien odio pellentesque."
      },
      {
        title: "Question 2",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus senectus nunc, ac arcu, egestas quisque lectus et lorem. Commodo neque urna, pellentesque ante dui ut enim turpis quam. Non nulla enim tristique tellus. Neque elementum morbi etiam proin sapien odio pellentesque."
      },
      {
        title: "Question 3",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus senectus nunc, ac arcu, egestas quisque lectus et lorem. Commodo neque urna, pellentesque ante dui ut enim turpis quam. Non nulla enim tristique tellus. Neque elementum morbi etiam proin sapien odio pellentesque."
      },
      {
        title: "Question 4",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus senectus nunc, ac arcu, egestas quisque lectus et lorem. Commodo neque urna, pellentesque ante dui ut enim turpis quam. Non nulla enim tristique tellus. Neque elementum morbi etiam proin sapien odio pellentesque."
      },
      {
        title: "Question 5",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus senectus nunc, ac arcu, egestas quisque lectus et lorem. Commodo neque urna, pellentesque ante dui ut enim turpis quam. Non nulla enim tristique tellus. Neque elementum morbi etiam proin sapien odio pellentesque."
      }
    ];

    this.state = {
      thankYou: false,
      offices: [
        { label: "Monaco | France", value: { id: 1, name: "Monaco | France" } },
        { label: "Spain", value: { id: 1, name: "Spain" } },
        { label: "Greece", value: { id: 1, name: "Greece" } },
        { label: "Italy", value: { id: 1, name: "Italy" } },
        { label: "ADRIATIC", value: { id: 1, name: "ADRIATIC" } },
        { label: "Caribbean", value: { id: 1, name: "Caribbean" } }
      ],
      loading: false,
      scrollDown: true
    };
    this.submitForm = this.submitForm.bind(this);
  }

  scrollTo(name) {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  submitForm(values) {
    this.setState({
      loading: true
    });
    postContactMessage(values).then(response => {
      if (response.code === 201) {
        this.setState({
          thankYou: true,
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <Default
        nav="fixed"
        search
        meta={{
          title: "Detail Page | OCEAN PREMIUM",
          description:
            "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
        }}
      >
        <div className="get-in-touch-background">
          <div className="heading">
            <h1 className="page-title on-shop">Get in touch</h1>
            <p>Questions regarding rentals or purchases?</p>
            <p>We are ready to help!</p>
          </div>
          <div>
            <div
              className={classnames("scroll-down-circle", {
                "display-none": !this.state.scrollDown
              })}
            >
              <img src="/static/images/Ellipse 2.png" />
            </div>
            <div
              className={classnames("scroll-down-arrow", {
                "display-none": !this.state.scrollDown
              })}
            >
              <img
                alt="scroll"
                onClick={() => this.scrollTo("general-contact")}
                src="/static/images/Vector 9.png"
              />
            </div>
          </div>
        </div>

        <div className="page-wrapper-simple">
          <div name="faqs"></div>
          <div className="container tiles">
            <div className="section">
              <h1>FAQs</h1>
              <Accordion>
                {this.faqs.map(item => (
                  <div label={item.title}>
                    <div className="container">
                      <p>{item.content}</p>
                    </div>
                  </div>
                ))}
              </Accordion>
              <div name="general-contact"></div>
            </div>

            <div className="section">
              <h1>For General Questions</h1>
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h3>Send us a message</h3>
                      {this.state.thankYou === true ? (
                        <div>
                          <h3>Thank you</h3>
                          <p>We will answer your message as soon as possible</p>
                        </div>
                      ) : (
                        <Formik
                          validationSchema={ContactFormSchema}
                          onSubmit={this.submitForm || undefined}
                          enableReinitialize
                          initialValues={{
                            name: "",
                            office: "",
                            emailAddress: "",
                            phoneNumber: "",
                            message: "",
                            enquiryType: ""
                          }}
                        >
                          {({ setFieldValue, values, errors, touched }) => (
                            <Form>
                              <div>
                                <div className="keyword form-block">
                                  <label htmlFor="keyword">Name</label>
                                  <Field
                                    name="name"
                                    component={CustomInputComponent}
                                  />
                                </div>

                                <div
                                  style={{ width: "50%", float: "left" }}
                                  className="form-left"
                                >
                                  <div className="keyword form-block">
                                    <label htmlFor="emailAddress">Email</label>
                                    <Field
                                      name="emailAddress"
                                      component={CustomInputComponent}
                                      placeHolder="@"
                                    />
                                  </div>
                                </div>
                                <div
                                  style={{ width: "50%", float: "left" }}
                                  className="form-right"
                                >
                                  <div className="keyword form-block">
                                    <label htmlFor="phoneNumber">
                                      Phone number
                                    </label>
                                    <Field
                                      name="phoneNumber"
                                      component={CustomInputComponent}
                                      placeHolder="+00 123 456 789"
                                    />
                                  </div>
                                </div>
                                <div className="keyword form-block">
                                  <label htmlFor="message">Message</label>
                                  <Field
                                    validation
                                    name="message"
                                    setFieldValue={setFieldValue}
                                    component="textarea"
                                  />
                                </div>
                                <div className="keyword form-block">
                                  <RadioButtonGroup
                                    id="radioGroup"
                                    label=""
                                    value={values.enquiryType}
                                    error={errors.enquiryType}
                                    touched={touched.enquiryType}
                                  >
                                    <Field
                                      component={RadioButton}
                                      name="enquiryType"
                                      id="radioOption1"
                                      label="Rentals"
                                    />
                                    <Field
                                      component={RadioButton}
                                      name="enquiryType"
                                      id="radioOption2"
                                      label="Sales"
                                    />
                                  </RadioButtonGroup>
                                </div>
                                <button
                                  disabled={this.state.loading === true}
                                  className="search-button-full"
                                  type="submit"
                                >
                                  Send message
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      )}

                      {this.state.loading ? <Loader /> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section">
              <h1>Questions related to Rentals</h1>
              <p>
                For questions related to your rental booking, drop-offs and/or
                pick-ups, locations or rental products or accessories you can
                check out our &nbsp;
                <a
                  href="#"
                  className="yellow"
                  onClick={() => this.scrollTo("faqs")}
                >
                  FAQs
                </a>
                &nbsp; or send us a message via the contact form below. We will
                get back to you as quickly as a possible.
              </p>
              <p>
                You can also send an email or call us directly at one of our
                HQs.
              </p>
              <table className="contact-table">
                <tr>
                  <td>
                    <img alt="email" src="/static/images/email-icon.png" />
                  </td>
                  <td>
                    <p className="uppercase">Email</p>
                    <strong>booking@oceanpremium.com</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src="/static/images/phone-icon.png" alt="phone" />
                  </td>
                  <td>
                    <p className="uppercase">Phone</p>
                    <strong>+33 781 15 12 54</strong>
                  </td>
                </tr>
              </table>
            </div>

            <div className="section">
              <h1>Questions related to Purchases</h1>
              <p>
                For questions related to purchases of products or accessories
                you can check out our&nbsp;
                <a className="yellow" onClick={() => this.scrollTo("faqs")}>
                  FAQs
                </a>
                &nbsp; or send us a message via the contact form below. We will
                get back to you as quickly as a possible. You can also send an
                email or call us directly at one of our HQs.
              </p>
              <table className="contact-table">
                <tr>
                  <td>
                    <img alt="email" src="/static/images/email-icon.png" />
                  </td>
                  <td>
                    <p className="uppercase">Email</p>
                    <strong>supply@oceanpremium.com</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <img src="/static/images/phone-icon.png" alt="phone" />
                  </td>
                  <td>
                    <p className="uppercase">Phone</p>
                    <strong>+31 61 89 40 507</strong>
                  </td>
                </tr>
              </table>
            </div>

            <div className="section">
              <h3>Ocean Premium Offices</h3>
              <div className="maps">
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1uqybh4Cedy9BeWZxfU9_B606fnY"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>

            <div className="section">
              <div className="row">
                <div className="col-md-6">
                  <h3>Ocean Premium HQ - Netherlands</h3>
                  <table>
                    <tr>
                      <td>Street</td>
                      <td>Jupiter 65</td>
                    </tr>
                    <tr>
                      <td>Post Code</td>
                      <td>2685 LV</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>Poeldijk</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td>The Netherlands</td>
                    </tr>
                  </table>
                  <table className="contact-table">
                    <tr>
                      <td>
                        <img alt="email" src="/static/images/email-icon.png" />
                      </td>
                      <td>
                        <p className="uppercase">Email</p>
                        <strong>info@oceanpremium.com</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="/static/images/phone-icon.png" alt="phone" />
                      </td>
                      <td>
                        <p className="uppercase">Phone</p>
                        <strong>+31 61 89 40 507</strong>
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="col-md-6">
                  <h3>Ocean Premium HQ - France & Monaco</h3>
                  <table>
                    <tr>
                      <td>Street</td>
                      <td>8 Boulevard d’Aquillon</td>
                    </tr>
                    <tr>
                      <td>Post Code</td>
                      <td>66000</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>Antibes</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td>France</td>
                    </tr>
                  </table>
                  <table className="contact-table">
                    <tr>
                      <td>
                        <img alt="email" src="/static/images/email-icon.png" />
                      </td>
                      <td>
                        <p className="uppercase">Email</p>
                        <strong>monaco@oceanpremium.com</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img src="/static/images/phone-icon.png" alt="phone" />
                      </td>
                      <td>
                        <p className="uppercase">Phone</p>
                        <strong>+33 640 62 95 99</strong>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(ContactPage);
