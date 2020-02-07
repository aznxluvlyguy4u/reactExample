import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from '../formComponents/datepicker/datepicker';
import CustomSelect from '../formComponents/select/customSelect';
import NumberInput from '../formComponents/number-input/number-input';
import searchValidation from '../searchComponents/searchForm/searchValidation';
import LocalStorageUtil from '../../utils/localStorageUtil';

class ProductBookingForm extends Component {

  constructor(props) {
    super(props);

    const cart = LocalStorageUtil.getCart() || [];
    
    const bookingDropDown = [
      { 
        id: undefined,
        label: 'New Booking',
        name: 'New Booking',
        deliveryDate: new Date(),
        collectionDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        products: [],
      },
    ];

    cart.forEach((cartItem) => {
      bookingDropDown.push(cartItem);
    });

    this.state = {
      bookingDropDown: bookingDropDown,
      cartItem: { bookingCollection: {}, qty: this.props.product.qty },
      cart: cart,
    };
  }
  onSubmit(values) {

    console.log(values);

    let productIndex = values.bookingItem.products.findIndex(x => x.id == this.props.product.id);
    console.log(productIndex);
    if (productIndex > -1) {
      values.bookingItem.products[productIndex].qty = values.qty;
    } else {
      values.bookingItem.products.push(this.props.product);
    }

    const cartItem = {
      id: values.bookingItem.value ? values.bookingItem.value : new Date().getUTCSeconds(),
      label: `${values.collectionLocation.label} - ${values.deliveryLocation.label}`,
      qty: values.qty,
      deliveryLocation: values.deliveryLocation,
      collectionLocation: values.collectionLocation,
      collectionDate: values.collectionDate,
      deliveryDate: values.deliveryDate,
      products: values.bookingItem.products
    };

    const bookingItemIndex = this.state.cart.findIndex(x => x.id === cartItem.id);
    if (bookingItemIndex > -1) {
      this.state.cart[bookingItemIndex] = cartItem;
    } else {
      this.state.cart.push(cartItem);
    }
    //LocalStorageUtil.setCart(this.state.cart);
  }

  setFormFromBooking(cartItem) {
    let existingCartItem = this.state.cartItem;

    if (existingCartItem.id === undefined) {
      existingCartItem.bookingCollection = cartItem;
      existingCartItem.collectionLocation = existingCartItem.collectionLocation ? existingCartItem.collectionLocation : cartItem.collectionLocation;
      existingCartItem.deliveryLocation = existingCartItem.deliveryLocation ? existingCartItem.deliveryLocation : cartItem.deliveryLocation;
      existingCartItem.deliveryDate = existingCartItem.deliveryDate ? existingCartItem.deliveryDate : cartItem.deliveryDate;
      existingCartItem.collectionDate = existingCartItem.collectionDate ? existingCartItem.collectionDate : cartItem.collectionDate;
      existingCartItem.products = [this.props.product];
    } else {
      console.log(cartItem);
      let qtyIndex = cartItem.products.findIndex(this.props.product.id);
      cartItem.qty = cartItem.products[qtyIndex].qty;
      existingCartItem = cartItem;
    }
    this.setState({cartItem: existingCartItem});
  }

  setQty(value) {
    const cartItem = this.state.cartItem;
    cartItem.qty = value;
    this.props.product.qty = value;
    this.setState({cartItem: cartItem});
  }

  handleDateChange = (e) => {
    console.log('date change',e);
  };

  render() {
    return (
      <div>
        <Formik
          validationSchema={searchValidation}
          enableReinitialize
          initialValues={{
            bookingItem: this.state.cartItem.bookingCollection,
            deliveryLocation: this.state.cartItem.deliveryLocation,
            collectionLocation: this.state.cartItem.deliveryLocation,
            collectionDate: this.state.cartItem.collectionDate,
            deliveryDate: this.state.cartItem.deliveryDate,
            qty: this.state.cartItem.qty,
          }}
          onSubmit={this.onSubmit.bind(this)}
        >
          {({ setFieldValue }) => (
            <Form>
              <div>
                <div className="keyword form-block">
                  <label htmlFor="keyword">Add to Booking</label>
                  <Field
                    options={this.state.bookingDropDown}
                    name="bookingItem"
                    placeholder="New Booking"
                    value={this.state.cartItem.bookingCollection}
                    setFieldValue={setFieldValue}
                    component={CustomSelect}
                    onSelect={this.setFormFromBooking.bind(this)}
                  />
                </div>
                <div className="form-inline">
                  <div className="location form-block">
                    <label htmlFor="deliveryLocation uppercase">Pick-up Location</label>
                    <Field
                      options={this.props.locationReducer.selectboxLocations}
                      name="deliveryLocation"
                      placeholder="Location"
                      value={this.state.cartItem.deliveryLocation}
                      setFieldValue={setFieldValue}
                      component={CustomSelect}
                    />
                  </div>
                  <div className="location form-block">
                    <label htmlFor="collectionLocation uppercase">Drop-Off Location</label>
                    <Field
                      options={this.props.locationReducer.selectboxLocations}
                      name="collectionLocation"
                      placeholder="Location"
                      value={this.state.cartItem.collectionLocation}
                      setFieldValue={setFieldValue}
                      component={CustomSelect}
                    />
                  </div>
                </div>
                <div className="date form-block">
                  <div className="label-wrapper">
                    <label htmlFor="collectionDateRange uppercase">Pick-up Date</label>
                    <label htmlFor="collectionDateRange uppercase">Drop-off Date</label>
                  </div>
                  <Field
                    placeholders={['Date', 'Date']}
                    setFieldValue={setFieldValue}
                    name="collectionDate"
                    placeholder="Date"
                    startDate={this.state.cartItem.deliveryDate}
                    endDate={this.state.cartItem.collectionDate}
                    component={DatePicker}
                  />
                </div>
                <div className="row">
                  <div className="col-5">
                      <strong>€ {this.props.product.rates[0].price}</strong>EUR
                      <div className="per-day-text">per day</div>
                  </div>
                  <div className="col-7">
                    <span className="yellow uppercase"><img src="static/images/alert.png" /> Not available</span>
                    Please adjust location, dates or quantity to add this item to your booking!
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <NumberInput
                      name="qty"
                      placeholder="Location"
                      value={this.state.cartItem.qty}
                      setFieldValue={setFieldValue}
                      changeValue={this.setQty.bind(this)}
                    />
                  </div>
                  <div className="col-6">
                    <button className="search-button-full" type="submit">
                      <i className="icon-cart" />
                      Add to booking
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = ({ locationReducer }) => {
  return {
    locationReducer,
  };
};

export default connect(mapStateToProps, {})(ProductBookingForm);
