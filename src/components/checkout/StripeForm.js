import React, { Component } from "react";
import {
  CardElement,
  injectStripe,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from "react-stripe-elements";

class StripeForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="form-block">
          <div className="form-block">
            <div className="input-wrapper">
              <label>Card Number</label>
              <CardNumberElement onReady={this.props.onReady} />
              <br />
              <div className="form-inline">
                <div className="form-block px-0 mr-1" style={{width: '50%'}}>
                  <label>Expiration Date</label>
                  <CardExpiryElement onReady={this.props.onReady} />
                </div>
                <div className="form-block px-0 ml-1" style={{width: '50%'}}>
                  <label>Security Code</label>
                  <CardCvcElement onReady={this.props.onReady} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mr-3">
          <button
            className="fullwidth-button"
            onClick={() => this.props.handleSubmit()}
          >
            Pay
          </button>
        </div>
      </div>
    );
  }
}

export default injectStripe(StripeForm);
