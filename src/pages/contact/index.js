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

  scrollTo() {
    scroller.scrollTo("scroll-to-element", {
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
                onClick={() => this.scrollTo("myFrame")}
                src="/static/images/Vector 9.png"
              />
            </div>
          </div>
        </div>
        <div className="container tiles">
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
          <h1>Questions related to Rentals</h1>
          <p>
            For questions related to your rental booking, drop-offs and/or
            pick-ups, locations or rental products or accessories you can check
            out our FAQs or send us a message via the contact form below. We
            will get back to you as quickly as a possible.
          </p>
          <p>
            You can also send an email or call us directly at one of our HQs.
          </p>
          <table>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
        <div className="page-wrapper tiles">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1 className="main-title">Contact Us</h1>
                <div className="row">
                  <div className="col-md-4">
                    <img
                      width="100%"
                      alt="Contact"
                      src="static/images/about/Barbara.png"
                    />
                  </div>
                  <div className="col-md-8">
                    <p>
                      Feel free to contact any of our offices for any questions
                      you have
                      <br />
                      <br />
                      We are available to help 24/7.
                    </p>
                    <a href="tel:+33 640 62 95 99" className="button-border">
                      +33 640 62 95 99
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-4 col-lg-4 col-sm-12">
                <h1 className="main-title">Contact Form</h1>
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
                      message: ""
                    }}
                  >
                    {({ setFieldValue }) => (
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
                              />
                            </div>
                          </div>
                          <div
                            style={{ width: "50%", float: "left" }}
                            className="form-right"
                          >
                            <div className="keyword form-block">
                              <label htmlFor="phoneNumber">Phone number</label>
                              <Field
                                name="phoneNumber"
                                component={CustomInputComponent}
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
                          <button
                            disabled={this.state.loading === true}
                            className="search-button-full"
                            type="submit"
                          >
                            Submit
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}

                {this.state.loading ? <Loader /> : null}
              </div>
            </div>
            <div className="maps">
              <iframe
                name="scroll-to-element"
                src="https://www.google.com/maps/d/embed?mid=1uqybh4Cedy9BeWZxfU9_B606fnY"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(ContactPage);
