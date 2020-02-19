import React, { Component, Fragment } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Script from "react-load-script";
import RadioButton from "../../../formComponents/radioButton/radioButton";
import RadioButtonGroup from "../../../formComponents/radioButton/radioButtonGroup";
import CheckoutPayFormSchema from "./checkoutPayFormSchema";
import StripeForm from "../../StripeForm";
import { Elements, StripeProvider } from "react-stripe-elements";
import PlaceOrderRequest from "../../../../utils/mapping/products/placeOrderRequest";
import { handlePaymentError } from "../../../../utils/rest/error/toastHandler";
import {
  orderCartItems,
} from "../../../../utils/rest/requests/orders";
import CartUtils from "../../../../utils/mapping/cart/cartUtils";

const options = [
  {
    value: "CARD",
    label: "Creditcard",
    srcDefault: "/static/images/credit-card-default.png",
    srcSelected: "/static/images/credit-card-selected.png"
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank transfer",
    srcDefault: "/static/images/bank-transfer-default.png",
    srcSelected: "/static/images/bank-transfer-selected.png"
  }
];

const cartUtils = new CartUtils();

class CheckoutPayForm extends Component {
  constructor(props) {
    super(props);
    let cartItem = props.cartItem;

    let order = null;

    const orderJson = sessionStorage.getItem(`order_${cartItem.id}`);
    if (orderJson !== "") {
      order = JSON.parse(orderJson);
    }

    if (!order) {
      this.setNewOrder(cartItem, "CARD");
    }

    this.state = {
      cartItem,
      initialValues: {
        creditCard: {
          cardNumber: "",
          expiryDate: "",
          securityCode: ""
        }
      },
      paymentMethod: "",
      order
    };
  }

  setNewOrder(cartItem, paymentMethod) {
    // New order/ payment intent
    const request = new PlaceOrderRequest(
      cartItem.location,
      cartItem.period,
      cartItem.products,
      cartItem.contactInformation,
      cartItem.billingInformation,
      paymentMethod
    ).returnOrder();
    this.setState({ loading: true });
    orderCartItems(request)
      .then(res => {
        if (res.code === 201) {
          this.setState({
            loading: false,
            order: res.data
          });
          this.setOrder(res.data);
          this.setPaymentIntent(res.data.paymentIntent);
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          orderFormStep: 3
        });
      });
  }

  onStripeLoad() {
    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe("pk_test_SPrjeYdGu3H0tTOVIIb8ZXAz00DaImy6UI")
      });
    }
  }

  setOrder = order => {
    const orderJson = JSON.stringify(order);
    sessionStorage.setItem(`order_${this.state.cartItem.id}`, orderJson);
    this.setState({ order });
  };

  updateSelectedPaymentMethod(event) {
    this.setState({ paymentMethod: event.currentTarget.value });
    this.props.updateSelectedPaymentMethod(event.currentTarget.value);
  }

  setSelected(value) {
    this.setState({ paymentMethod: value });
    this.props.updateSelectedPaymentMethod(value);
  }

  setPaymentIntent = paymentIntent => {
    const paymentIntentJson = JSON.stringify(paymentIntent);
    sessionStorage.setItem(
      `paymentIntent${this.state.cartItem.id}`,
      paymentIntentJson
    );
  };

  getPaymentIntent = () => {
    const paymentIntentJson = sessionStorage.getItem(
      `paymentIntent${this.state.cartItem.id}`
    );
    let paymentIntent = null;
    if (paymentIntentJson !== "") {
      paymentIntent = JSON.parse(paymentIntentJson);
    }
    return paymentIntent;
  };

  handleReady = element => {
    this.element = element;
  };

  handleStripePayment = e => {
    //Show Loader
    this.state.stripe
      .confirmCardPayment(this.getPaymentIntent().clientSecret, {
        payment_method: {
          card: this.element,
          billing_details: {
            address: {
              country: this.state.cartItem.billingInformation.country.name,
              line1: this.state.cartItem.billingInformation.streetName,
              postal_code: this.state.cartItem.billingInformation.postalCode,
            },
            email: this.state.cartItem.billingInformation.emailAddress,
            name: this.state.cartItem.billingInformation.firstName,
            phone: this.state.cartItem.billingInformation.phoneNumber,
          } 
        }
      })
      .then(payload => {
        if (payload.error) {
          //Set stuff for loader
          //Hide Loader
          handlePaymentError(payload.error);
        } else {
          console.log("aweh");
          this.props.completeBooking();
          //Set states
          //Remove Item from cart
          //Hide Loader
        }
      });
  };

  render() {
    return (
      <div className="checkout">
        <div className="row">
          <div className="col-6">
            <Formik
              enableReinitialize
              validationSchema={CheckoutPayFormSchema}
              initialValues={{
                paymentMethod: null
              }}
              onSubmit={this.props.handleSubmit}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <div className="paymentMethod form-block">
                    {values.paymentMethod}
                    <RadioButtonGroup
                      id="radioGroup"
                      label=""
                      value={this.state.paymentMethod}
                      error={errors.paymentMethod}
                      touched={touched.paymentMethod}
                    >
                      {options.map(option => (
                        <div className="row align-items-center">
                          <div className="col-8 text-center">
                            <img
                              onClick={() => this.setSelected(option.value)}
                              className="img-fluid"
                              src={
                                this.state.paymentMethod === option.value
                                  ? option.srcSelected
                                  : option.srcDefault
                              }
                            />
                          </div>
                          <div className="col-4 text-left">
                            <Field
                              component={RadioButton}
                              name="paymentMethod"
                              id={option.value}
                              label=""
                              value={option.value}
                              selectedValue={this.state.paymentMethod}
                              onChange={this.updateSelectedPaymentMethod.bind(
                                this
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </RadioButtonGroup>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="col-6">
            <div className="bordered-container">
              {this.state.paymentMethod === "CARD" &&
                this.state.stripe &&
                this.getPaymentIntent() && (
                  <Fragment>
                    <h2 className="mt-0 divider">Credit Card</h2>
                    <table>
                      <tr>
                        <td>4% Credit Card Fee</td>
                        <td className="text-right">
                          €{" "}
                          {cartUtils.getCartItemPercentage(
                            this.props.cartItem,
                            4
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Rental Fee</td>
                        <td className="text-right">
                          € {cartUtils.getCartItemTotal(this.props.cartItem)}
                        </td>
                      </tr>
                      <tr>
                        <td>Total Costs</td>
                        <td className="text-right">
                          €{" "}
                          {cartUtils.getCartItemTotalWithFee(
                            this.props.cartItem,
                            4
                          )}
                        </td>
                      </tr>
                    </table>
                    <div className="divider py-2 mb-4"></div>
                    <StripeProvider stripe={this.state.stripe}>
                      <Elements>
                        <Fragment>
                          <StripeForm
                            onReady={this.handleReady}
                            paymentIntent={this.getPaymentIntent()}
                            handleSubmit={() => {
                              this.handleStripePayment();
                            }}
                          />
                        </Fragment>
                      </Elements>
                    </StripeProvider>
                  </Fragment>
                )}
              {this.state.paymentMethod === "BANK_TRANSFER" &&
                this.state.order &&
                this.state.stripe &&
                this.getPaymentIntent() && (
                  <Fragment>
                    <h2 className="mt-0 divider">Bank Transfer</h2>
                    <p className="divider pb-4">
                      Please transfer the total amount to the following account
                      including the payment ID in the description.
                    </p>
                    <div>
                      <p>
                        <strong>Total Amount</strong>
                        <br />
                        € {cartUtils.getCartItemTotal(this.props.cartItem)}
                      </p>
                      <p>
                        <strong>Bank Account</strong>
                        <br />
                        NL19  ABCD  1234 9876  01
                      </p>
                      <p>
                        <strong>BIC / SWIFT Code</strong>
                        <br />
                        123they
                      </p>
                      <p>
                        <strong>Payment ID</strong>
                        <br />
                        {this.state.order.orderId}
                      </p>
                    </div>
                  </Fragment>
                )}
                {this.state.paymentMethod === "" && <p>Please select a payment method</p>}
            </div>
            <Script
              url="https://js.stripe.com/v3/"
              onLoad={() => this.onStripeLoad()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutPayForm;
