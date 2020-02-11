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

    const bookingDropDown = this.setUpCartItemSelection(cart);
    this.state = {
      bookingDropDown,
      productBookingForm: {
        booking: '',
        location: { delivery: '', collection: '' },
        period: { start: new Date() , end: new Date(new Date().setDate(new Date().getDate() + 1))},
        qty: props.product.qty,
        accessories: [],
      },
      cart,
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
      products: values.bookingItem.products,
    };

    const bookingItemIndex = this.state.cart.findIndex(x => x.id === cartItem.id);
    if (bookingItemIndex > -1) {
      this.state.cart[bookingItemIndex] = cartItem;
    } else {
      this.state.cart.push(cartItem);
    }
    //LocalStorageUtil.setCart(this.state.cart);
  }

  setUpCartItemSelection(cart) {
    console.log(this.props.propduct);
    console.log(cart);
    
    const start = new Date();
    const end = new Date(new Date().setDate(new Date().getDate() + 1));

    const bookingDropDown = [
      { 
        id: undefined,
        label: 'New Booking',
        name: 'New Booking',
        period: { start, end },
        location: { delivery: {}, collection: {} },
        accessories: [],
      },
    ];

    cart.forEach((cartItem) => {
      let dropDownItem = cartItem;
      dropDownItem.label = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`;
      dropDownItem.name = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`,
      bookingDropDown.push(dropDownItem);
    });

    return bookingDropDown;
  }

  setFormFromBooking(cartItem) {
    if (cartItem.id === undefined) {
      console.log('Do nothing for now');
    } else {
      if (cartItem.id == this.props.product.id) {
        let productBookingForm = this.state.productBookingForm;
        productBookingForm.qty = cartItem.quantity;
        productBookingForm.booking = cartItem;

        cartItem.location.delivery = cartItem.location.delivery;
        cartItem.location.delivery.value = cartItem.location.delivery;
        cartItem.location.delivery.label = cartItem.location.delivery.name;

        cartItem.location.collection = cartItem.location.collection;
        cartItem.location.collection.value = cartItem.location.collection;
        cartItem.location.collection.label = cartItem.location.collection.name;

        productBookingForm.location = cartItem.location;
        productBookingForm.period = cartItem.period;
        this.setState({productBookingForm});
      }
    }
  }

  setQty(value) {
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.qty = value;
    this.setState({productBookingForm});
    console.log(this.state.productBookingForm);
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
            bookingItem: this.state.productBookingForm.booking,
            deliveryLocation: this.state.productBookingForm.location.delivery,
            collectionLocation: this.state.productBookingForm.location.collection,
            collectionDate: this.state.productBookingForm.period.start,
            deliveryDate: this.state.productBookingForm.period.end,
            qty: this.props.product.qty,
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
                    value={this.state.productBookingForm.booking}
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
                      value={this.state.productBookingForm.location.delivery}
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
                      value={this.state.productBookingForm.location.collection}
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
                    startDate={this.state.productBookingForm.period.start}
                    endDate={this.state.productBookingForm.period.end}
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
                      value={this.state.productBookingForm.qty}
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
