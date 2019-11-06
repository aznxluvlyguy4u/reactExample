import React, {Component} from 'react';
import {CardElement, injectStripe, CardNumberElement, CardCvcElement, CardExpiryElement} from 'react-stripe-elements';

class StripeForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signup checkout">
        <h1>Payment</h1>
        <p>Please fill in your creditcard details</p>
        <div className="form-block">
          <div className="form-block">
            <div className="input-wrapper">
              <CardNumberElement onReady={this.props.onReady} />
              <br />
              <CardCvcElement onReady={this.props.onReady} />
              <br />
              <CardExpiryElement onReady={this.props.onReady} />
            </div>
          </div>
        </div>
        <span>
          <a
            className="button-border fullwidth"
            onClick={() => this.props.cancel()}>
              Back
          </a>
          <button
            className="fullwidth-button"
            onClick={() => this.props.handleSubmit()}>
            Purchase
          </button>
        </span>
      </div>
    );
  }
}

export default injectStripe(StripeForm);
