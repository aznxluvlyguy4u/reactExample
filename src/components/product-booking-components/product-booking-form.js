import { Field, Form, Formik } from "formik";
import Router from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import RecommendedAccessoryView from "../../components/product-booking-components/recommended-accessories";
import DatePicker from "../formComponents/datepicker/datepicker";
import CustomSelect from "../formComponents/select/customSelect";
import NumberInput from "../formComponents/number-input/number-input";
import productBookingFormValidation from "./product-booking-form-validation";
import LocalStorageUtil from "../../utils/localStorageUtil";
import { getProductById } from "../../utils/rest/requests/products";
import { setProductOptionalAccessories } from "../../actions/localSearchActions";
import moment from "moment";

class ProductBookingForm extends Component {
  constructor(props) {
    super(props);
    const cart = LocalStorageUtil.getCart() || [];

    const bookingDropDown = this.setUpCartItemSelection(cart);
    this.state = {
      accessories: [],
      bookingDropDown,
      productBookingForm: {
        booking: "",
        location: { delivery: "", collection: "" },
        period: {
          start: new Date(),
          end: new Date(new Date().setDate(new Date().getDate() + 1))
        },
        qty: props.product.qty,
        accessories: []
      },
      cart
    };
  }

  onSubmit(values) {
    console.log(values);

    if (this.state.productBookingForm.qty === 0) {
      return;
    }

    let cart = this.state.cart;
    const period = { start: values.collectionDate, end: values.deliveryDate };
    const location = {
      collection: { id: values.collectionLocation.id, name: values.collectionLocation.name },
      delivery: { id: values.deliveryLocation.id, name: values.deliveryLocation.name },
    };
    const product = {
      id: this.props.product.id,
      accessories: this.state.accessories,
      quantity: this.state.productBookingForm.qty,
    };

    if (values.bookingItem.id !== undefined) {
      const cartItemIndex = cart.findIndex(cartItem => cartItem.id === values.bookingItem.id && cartItem.name === values.bookingItem.name);
      cart[cartItemIndex].period = period;
      cart[cartItemIndex].location = location;
      const productIndex = cart[cartItemIndex].products.findIndex(product => product.id === this.props.product.id);
      if (productIndex >= 0) {
        cart[cartItemIndex].products[productIndex] = product;
      } else {
        cart[cartItemIndex].products.push(product);
      }
    } else {
      const cartItem = {
        id: moment().unix(),
        period,
        location,
        products: [product],
      };
      cart.push(cartItem);
    }
    LocalStorageUtil.setCart(cart);

    const cartItemIndex = cart.findIndex(cartItem => cartItem.id === values.bookingItem.id && cartItem.name === values.bookingItem.name);
    this.props.setCartItemIndex(cartItemIndex);
    this.props.setStep(2);
  }

  async getProduct() {
    let response = await getProductById(this.props.product.id);
    this.props.product.accessories = response.data.accessories;

    const accessories = this.props.product.accessories.filter(
      val => val.type === "OPTIONAL"
    );

    accessories.map(accessory => {
      const index = this.state.accessories.findIndex(x => x.id == accessory.id);
      if (index >= 0) {
        // eslint-disable-next-line no-param-reassign
        accessory.selected = true;
      }
    });

    this.props.setProductOptionalAccessories(accessories);
  }

  setUpCartItemSelection(cart) {
    const accessories = this.props.product.accessories.filter(
      val => val.type === "OPTIONAL"
    );
    this.props.setProductOptionalAccessories(accessories);

    if (this.props.product.accessories.length === 0) {
      this.getProduct();
    }

    const start = new Date();
    const end = new Date(new Date().setDate(new Date().getDate() + 1));

    const bookingDropDown = [
      {
        id: undefined,
        label: "New Booking",
        name: "New Booking",
        period: { start, end },
        location: { delivery: {}, collection: {} },
        accessories: []
      }
    ];

    cart.forEach(cartItem => {
      let dropDownItem = cartItem;
      dropDownItem.label = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`;
      (dropDownItem.name = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`),
        bookingDropDown.push(dropDownItem);
    });

    return bookingDropDown;
  }

  async setFormFromBooking(cartItem) {
    this.setState({ accessories: [] });

    this.props.localSearchReducer.productOptionalAccessories.map(
      accessory => { accessory.selected = false; }
    );

    if (cartItem.id !== undefined) {
      let productBookingForm = this.state.productBookingForm;
      productBookingForm.booking = cartItem;
      productBookingForm.qty =
        productBookingForm.qty > 0 ? productBookingForm.qty : 0;
      let bookingAccessories = [];

      cartItem.products.map(product => {
        if (product.id == this.props.product.id) {
          productBookingForm.qty = product.quantity;
          bookingAccessories = product.accessories || [];
        }
      });

      cartItem.location.delivery = cartItem.location.delivery;
      cartItem.location.delivery.value = cartItem.location.delivery;
      cartItem.location.delivery.label = cartItem.location.delivery.name;

      cartItem.location.collection = cartItem.location.collection;
      cartItem.location.collection.value = cartItem.location.collection;
      cartItem.location.collection.label = cartItem.location.collection.name;

      productBookingForm.location = cartItem.location;
      productBookingForm.period = cartItem.period;

      this.props.localSearchReducer.productOptionalAccessories.map(
        (accessory) => {
          const index = bookingAccessories.findIndex(
            x => x.id == accessory.id
          );
          if (index >= 0) {
            // eslint-disable-next-line no-param-reassign
            accessory.selected = true;
          }
          return accessory;
      });
      

      this.setState({ accessories: bookingAccessories });
      this.setState({ productBookingForm: productBookingForm });
    }
  }

  setQty(value) {
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.qty = value;
    this.setState({ productBookingForm });
  }

  handleDateChange = e => {
    console.log("date change", e);
  };

  changeAccesoire(toggledAccessory) {
    const bookingAccessories = this.state.accessories;
    if (
      toggledAccessory.selected &&
      !bookingAccessories.some(
        accessory => accessory.id === toggledAccessory.id
      )
    ) {
      // eslint-disable-next-line no-param-reassign
      toggledAccessory.quantity = 1;
      bookingAccessories.push(toggledAccessory);
    } else if (
      !toggledAccessory.selected &&
      bookingAccessories.some(accessory => accessory.id === toggledAccessory.id)
    ) {
      const removeIndex = bookingAccessories.findIndex(
        accessory => accessory.id === toggledAccessory.id
      );
      bookingAccessories.splice(removeIndex, 1);
    }
    this.setState({ accessories: bookingAccessories });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-7 equal-height-columns">
          <div className="row h-100 no-gutters">
            <div className="col-md-1 equal-height-columns">
              <img
                src="static/images/back-arrow-white.svg"
                alt="previous"
                onClick={ () => this.props.closeModal() }
              />
            </div>
            <div className="col-md-11 equal-height-columns">
              <div className="white-bg h-100 p-5">
                <div className="row">
                  <div className="col-md-9">
                    <h3>Add {this.props.product.name}</h3>
                    <p>Add to an existing booking or create a new one!</p>
                  </div>
                  <div className="col-md-3">
                    {this.props.product.images.length > 0 && (
                      <img
                        className="img-fluid"
                        alt={this.props.product.name}
                        src={this.props.product.images[0].url}
                      />
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div>
                      <Formik
                        validationSchema={productBookingFormValidation}
                        enableReinitialize
                        initialValues={{
                          bookingItem: this.state.productBookingForm.booking,
                          deliveryLocation: this.state.productBookingForm
                            .location.delivery,
                          collectionLocation: this.state.productBookingForm
                            .location.collection,
                          collectionDate: this.state.productBookingForm.period
                            .start,
                          deliveryDate: this.state.productBookingForm.period
                            .end,
                          qty: this.props.product.qty
                        }}
                        onSubmit={this.onSubmit.bind(this)}
                      >
                        {({ setFieldValue }) => (
                          <Form>
                            <div>
                              <div className="bookingItem form-block">
                                <label htmlFor="bookingItem">Add to Booking</label>
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
                                  <label htmlFor="deliveryLocation uppercase">
                                    Pick-up Location
                                  </label>
                                  <Field
                                    options={
                                      this.props.locationReducer
                                        .selectboxLocations
                                    }
                                    name="deliveryLocation"
                                    placeholder="Location"
                                    value={
                                      this.state.productBookingForm.location
                                        .delivery
                                    }
                                    setFieldValue={setFieldValue}
                                    component={CustomSelect}
                                  />
                                </div>
                                <div className="location form-block">
                                  <label htmlFor="collectionLocation uppercase">
                                    Drop-Off Location
                                  </label>
                                  <Field
                                    options={
                                      this.props.locationReducer
                                        .selectboxLocations
                                    }
                                    name="collectionLocation"
                                    placeholder="Location"
                                    value={
                                      this.state.productBookingForm.location
                                        .collection
                                    }
                                    setFieldValue={setFieldValue}
                                    component={CustomSelect}
                                  />
                                </div>
                              </div>
                              <div className="date form-block">
                                <div className="label-wrapper">
                                  <label htmlFor="collectionDateRange uppercase">
                                    Pick-up Date
                                  </label>
                                  <label htmlFor="collectionDateRange uppercase">
                                    Drop-off Date
                                  </label>
                                </div>
                                <Field
                                  placeholders={["Date", "Date"]}
                                  setFieldValue={setFieldValue}
                                  name="collectionDate"
                                  placeholder="Date"
                                  startDate={
                                    this.state.productBookingForm.period.start
                                  }
                                  endDate={
                                    this.state.productBookingForm.period.end
                                  }
                                  component={DatePicker}
                                />
                              </div>
                              <div className="row">
                                <div className="col-5">
                                  <strong>
                                    € {this.props.product.rates[0].price}
                                  </strong>{" "}
                                  EUR
                                  <div className="per-day-text">per day</div>
                                </div>
                                <div className="col-7">
                                  <div className="unavailable d-none">
                                    <span className="yellow-text uppercase">
                                      <img src="static/images/alert.png" /> Not
                                      available
                                    </span>
                                    <br />
                                    <small>
                                      Please adjust location, dates or quantity
                                      to add this item to your booking!
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-6">
                                  <div className="qty form-block">
                                    <Field
                                      name="qty"
                                      placeholder="Quantity"
                                      value={this.state.productBookingForm.qty}
                                      setFieldValue={setFieldValue}
                                      changeValue={this.setQty.bind(this)}
                                      component={NumberInput}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <button
                                    className="search-button-full"
                                    type="submit"
                                  >
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 equal-height-columns">
          <div className="white-bg h-100 p-5">
            <h3>Recommended Accessories</h3>
            <RecommendedAccessoryView
              // eslint-disable-next-line react/jsx-no-bind
              onSetSelectedUnselected={this.changeAccesoire.bind(this)}
              start={this.state.productBookingForm.period.start}
              end={this.state.productBookingForm.period.end}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ locationReducer, localSearchReducer }) => {
  return {
    locationReducer,
    localSearchReducer,
  };
};

export default connect(mapStateToProps, { setProductOptionalAccessories })(
  ProductBookingForm,
);
