import React, {Component} from 'react';
import CustomSelect from '../formComponents/select/customSelect';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import PaymentMethodFormSchema from './PaymentMethodFormSchema';

const options = [
  {value: "CARD", label: "Creditcard"},
  {value: "BANK_TRANSFER", label: "Bank transfer"}
]
class PaymentMethodForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signup checkout">
        <Formik
           enableReinitialize
           validationSchema={PaymentMethodFormSchema}
           initialValues={{
             paymentMethod: null
           }}
           onSubmit={this.props.handleSubmit} >
            {({ errors, setFieldValue }) => (
            <Form>
              <div className="form-block">
                <div className="input-wrapper">
                  <label htmlFor="affiliation">Select paymentmethod</label>
                  <Field
                    name="paymentMethod"
                    placeholder="Payment method"
                    isSearchable={false}
                    value={null}
                    setFieldValue={setFieldValue}
                    component={CustomSelect}
                    options={options} />
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
                    type="submit"
                  >
                    Next
                  </button>
                </span>
          </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default PaymentMethodForm;
