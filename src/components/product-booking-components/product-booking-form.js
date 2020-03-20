import { Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import RecommendedAccessoryView from "../../components/product-booking-components/recommended-accessories";
import DatePicker from "../formComponents/datepicker/datepicker";
import CustomSelect from "../formComponents/select/customSelect";
import NumberInput from "../formComponents/number-input/number-input";
import productBookingFormValidation from "./product-booking-form-validation";
import LocalStorageUtil from "../../utils/localStorageUtil";
import { getProductById } from "../../utils/rest/requests/products";
import { setProductOptionalAccessories } from "../../actions/localSearchActions";
import { checkAvailabilityGraph } from "../../utils/rest/requests/cart";
import { setCart } from "../../actions/cartActions";

class ProductBookingForm extends Component {
  constructor(props) {
    super(props);
    const cart = LocalStorageUtil.getCart() || [];
    this.bookingSelectElement = React.createRef();
    this.deliveryLocationSelectElement = React.createRef();
    this.collectionLocationSelectElement = React.createRef();
    this.datePickerSelectElement = React.createRef();
    this.quantityInputElement = React.createRef();

    const bookingDropDown = [];
    this.state = {
      dateRangeAvailability: {
        collection: false,
        delivery: false,
        booking: false,
        quantity: true,
      },
      accessories: [],
      bookingDropDown,
      productBookingForm: {
        booking: undefined,
        location: { delivery: undefined, collection: undefined },
        period: {
          start: new Date(new Date().setDate(new Date().getDate() + 1)),
          end: new Date(new Date().setDate(new Date().getDate() + 2))
        },
        qty: props.product.qty === 0 ? 1 : props.product.qty,
        accessories: []
      },
      availabilityGraphRequest: {
        id: this.props.product.id,
        quantity: props.product.qty === 0 ? 1 : props.product.qty,
        period: {
          start: null,
          end: null
        },
        location: {
          delivery: null,
          collection: null
        }
      },
      availabilityGraph: [],
      loadingAvailabilityGraph: false,
      cart
    };
  }

  async componentDidMount() {
    const {
      cart,
      productBookingForm,
      dateRangeAvailability,
      availabilityGraphRequest,
    } = this.state;
    const bookingDropDown = await this.setUpCartItemSelection(cart);

    await this.setState({ bookingDropDown });
    const { searchReducer, cartItemIndex } = this.props;

    
    if (cartItemIndex && bookingDropDown.length > cartItemIndex) {
      const cartItem = cart[cartItemIndex];
      productBookingForm.booking = bookingDropDown.find(x => x.id === cartItem.id);
      this.bookingSelectElement.updateStateValue(productBookingForm.booking);
      dateRangeAvailability.booking = true;
      await this.setState({
        productBookingForm,
        dateRangeAvailability
      });
    } else if (searchReducer.search.booking && !cartItemIndex) {
      productBookingForm.booking = bookingDropDown.find(x => x.id === searchReducer.search.booking.id);
      this.bookingSelectElement.updateStateValue(productBookingForm.booking);
      dateRangeAvailability.booking = true;
      await this.setState({
        productBookingForm,
        dateRangeAvailability
      });
    }

    if (searchReducer.search.deliveryLocation) {
      productBookingForm.location.delivery = searchReducer.search.deliveryLocation;
      dateRangeAvailability.delivery = true;
      availabilityGraphRequest.location.delivery = searchReducer.search.deliveryLocation;
      this.deliveryLocationSelectElement.updateStateValue(searchReducer.search.deliveryLocation);
      await this.setState({
        productBookingForm,
        dateRangeAvailability,
        availabilityGraphRequest,
      });
    }

    if (searchReducer.search.collectionLocation) {
      productBookingForm.location.collection = searchReducer.search.collectionLocation;
      this.collectionLocationSelectElement.updateStateValue(searchReducer.search.collectionLocation);
      dateRangeAvailability.collection = true;
      availabilityGraphRequest.location.collection = searchReducer.search.collectionLocation;

      await this.setState({
        productBookingForm,
        dateRangeAvailability,
      });
    }

    if (searchReducer.search.collectionDate) {
      productBookingForm.period.end = moment(
        searchReducer.search.collectionDate
      );
      dateRangeAvailability.collectionDate = true;
      this.datePickerSelectElement.updateEndDate(searchReducer.search.collectionDate);

      await this.setState({
        productBookingForm,
        dateRangeAvailability,
      });

      if (searchReducer.search.deliveryDate) {
        productBookingForm.period.start = moment(
          searchReducer.search.deliveryDate
        );
        this.datePickerSelectElement.updateStartDate(searchReducer.search.deliveryDate);
        dateRangeAvailability.deliveryDate = true;
        await this.setState({
          productBookingForm,
          dateRangeAvailability,
        });
        await this.getProduct();
      }
    }

    await this.updateAvailabilityGraph(productBookingForm.period.start);
  }

  onSubmit(values) {
    if (this.state.productBookingForm.qty === 0) {
      return;
    }

    let cart = this.state.cart;
    const period = { start: values.deliveryDate, end: values.collectionDate };
    const location = {
      collection: {
        id: values.collectionLocation.id,
        name: values.collectionLocation.name
      },
      delivery: {
        id: values.deliveryLocation.id,
        name: values.deliveryLocation.name
      },
    };
    const product = {
      id: this.props.product.id,
      accessories: this.state.accessories || [],
      quantity: this.state.productBookingForm.qty,
      images: this.props.product.images,
      rates: this.props.product.rates
    };

    if (values.bookingItem.id !== undefined) {
      const cartItemIndex = cart.findIndex(
        cartItem =>
          cartItem.id === values.bookingItem.id &&
          cartItem.name === values.bookingItem.name
      );
      cart[cartItemIndex].period = period;
      cart[cartItemIndex].location = location;
      const productIndex = cart[cartItemIndex].products.findIndex(
        product => product.id === this.props.product.id
      );
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
        products: [product]
      };
      values.bookingItem.id = cartItem.id;
      cart.push(cartItem);
    }
    this.props.setCart(cart);
    LocalStorageUtil.setCart(cart);
    const cartItemIndex = cart.findIndex(
      cartItem => cartItem.id === values.bookingItem.id
    );
    this.props.setCartItemIndex(cartItemIndex);
    this.props.setStep(2);
  }

  async getProduct() {
    
    const deliveryLocation = this.state ? this.state.availabilityGraphRequest.location.delivery : null;
    let response = await getProductById(this.props.product.id, deliveryLocation ? deliveryLocation.id : null);
    this.props.product.rates = response.data.rates;
    this.props.product.accessories = response.data.accessories;

    const accessories = response.data.accessories.filter(
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

  async setUpCartItemSelection(cart) {

    const start = new Date(new Date().setDate(new Date().getDate() + 1));
    const end = new Date(new Date().setDate(new Date().getDate() + 2));

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

  async updateDateRangeAvailability(field, valid) {
    const { dateRangeAvailability } = this.state;
    dateRangeAvailability[field] = false;
    if (valid) {
      dateRangeAvailability[field] = true;
    }
    await this.setState({ dateRangeAvailability, availabilityGraph: [] });
  }

  async calculateAvailabilityGraph(availabilityGraphRequest) {
    if (availabilityGraphRequest.quantity < 1) return;
    if (availabilityGraphRequest.location == null) return;
    if (availabilityGraphRequest.location.delivery == null) return;
    if (availabilityGraphRequest.location.collection == null) return;
    if (!availabilityGraphRequest.period.start || availabilityGraphRequest.period.start === "Invalid date" || !availabilityGraphRequest.period.end || availabilityGraphRequest.period.end === "Invalid date") return;
    if (this.state.loadingAvailabilityGraph) return;

    await this.setState({
      loadingAvailabilityGraph: true
    });

    const availabilityGraph = this.state.availabilityGraph;

    if (
      !availabilityGraph.find(x =>
        moment(x.date).isSame(
          moment(availabilityGraphRequest.period.start),
          "day"
        )
      )
    ) {
      const availabilityResult = await checkAvailabilityGraph(
        availabilityGraphRequest
      )
        .then(res => res)
        .catch(err => err);

      if (
        !availabilityResult.data ||
        !availabilityResult.data.availabilityGraph
      ) {
        await this.setState({
          loadingAvailabilityGraph: false
        });
        return;
      }

      const { productBookingForm } = this.state;
      
      const rangeUnavailable = availabilityResult.data.availabilityGraph.find(
        x =>
          moment(x.date).isSameOrAfter(
            moment(productBookingForm.period.start),
            "day"
          ) &&
          moment(x.date).isSameOrBefore(
            moment(productBookingForm.period.end),
            "day"
          ) &&
          !x.available
      );

      if (rangeUnavailable) {
        productBookingForm.period.start = null;
        productBookingForm.period.end = null;
        if (this.datePickerSelectElement) {
          this.datePickerSelectElement.updateDateRange(null, null);
        }
        availabilityGraphRequest.period.start = null;
        availabilityGraphRequest.period.end = null;
      }

      availabilityGraph.push(...availabilityResult.data.availabilityGraph);

      await this.setState({
        productBookingForm,
        availabilityGraph,
        loadingAvailabilityGraph: false,
        availabilityGraphRequest
      });
    } else {
      await this.setState({ loadingAvailabilityGraph: false });
    }
  }

  updateAvailabilityGraph(date) {
    const start = moment.utc(date).startOf("month");
    const end = moment(start).endOf("month");
    const { availabilityGraphRequest } = this.state;
    availabilityGraphRequest.period = {
      start: start.format("YYYY-MM-DDTHH:mm:ss.000+0000"),
      end: end.format("YYYY-MM-DDTHH:mm:ss.000+0000")
    };
    this.calculateAvailabilityGraph(availabilityGraphRequest);
  }

  async rangeCheck(startDate, endDate) {
    const { availabilityGraph, productBookingForm, availabilityGraphRequest } = this.state;
    const rangeUnavailable = availabilityGraph.find(
      x =>
        moment(x.date).isSameOrAfter(
          moment(startDate),
          "day"
        ) &&
        moment(x.date).isSameOrBefore(
          moment(endDate),
          "day"
        ) &&
        !x.available
    );

    if (rangeUnavailable) {
      productBookingForm.period.start = null;
      productBookingForm.period.end = null;
      this.datePickerSelectElement.updateDateRange(null, null);
      availabilityGraphRequest.period.start = null;
      availabilityGraphRequest.period.end = null;

      await this.setState({
        productBookingForm,
        availabilityGraph,
      });
    }
  }

  async setFormFromBooking(cartItem) {
    this.updateDateRangeAvailability("booking", true);
    this.setState({ accessories: [] });

    this.props.localSearchReducer.productOptionalAccessories.map(accessory => {
      accessory.selected = false;
    });

    if (cartItem.id !== undefined) {
      let availabilityGraphRequest = this.state.availabilityGraphRequest;
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
      const location = this.getSelectLocationFromCartItemLocation(cartItem.location);
      this.deliveryLocationSelectElement.updateStateValue(location.delivery);
      this.collectionLocationSelectElement.updateStateValue(location.collection);
      productBookingForm.location = location;
      productBookingForm.period = cartItem.period;
      this.props.localSearchReducer.productOptionalAccessories.map(
        accessory => {
          const index = bookingAccessories.findIndex(x => x.id == accessory.id);
          if (index >= 0) {
            // eslint-disable-next-line no-param-reassign
            accessory.selected = true;
          }
          return accessory;
        }
      );

      availabilityGraphRequest.location.collection = {
        name: cartItem.location.collection.name,
        id: cartItem.location.collection.id
      };
      availabilityGraphRequest.location.delivery = {
        name: cartItem.location.delivery.name,
        id: cartItem.location.delivery.id
      };
      availabilityGraphRequest.quantity = productBookingForm.qty;
      this.quantityInputElement.updateStateValue(productBookingForm.qty);

      if (availabilityGraphRequest.location.delivery.name) {
        this.updateDateRangeAvailability("delivery", true);
      }
      if (availabilityGraphRequest.location.collection.name) {
        this.updateDateRangeAvailability("collection", true);
      }

      const start = moment.utc(new Date(cartItem.period.start).setDate(1));
      const end = moment(start).endOf("month");
      availabilityGraphRequest.period = {
        start: start.format("YYYY-MM-DDTHH:mm:ss.000+0000"),
        end: end.format("YYYY-MM-DDTHH:mm:ss.000+0000")
      };
      this.datePickerSelectElement.updateDateRange(cartItem.period.start, cartItem.period.end);
      await this.setState({
        accessories: bookingAccessories,
        productBookingForm,
        availabilityGraph: [],
        availabilityGraphRequest
      });
      await this.updateAvailabilityGraph(cartItem.period.start);
    }
  }

  getSelectLocationFromCartItemLocation(cartItemLocation) {
    return {
      delivery: {
        id: cartItemLocation.delivery.id,
        name: cartItemLocation.delivery.name,
        label: cartItemLocation.delivery.name,
        value: {
          id: cartItemLocation.delivery.id,
        name: cartItemLocation.delivery.name,
        }
      },
      collection: {
        id: cartItemLocation.collection.id,
        name: cartItemLocation.collection.name,
        label: cartItemLocation.collection.name,
        value: {
          id: cartItemLocation.collection.id,
        name: cartItemLocation.collection.name,
        }
      }
    }
  }

  async handlePickupChange(e) {
    this.updateDateRangeAvailability("delivery", !!e.deliveryLocation);
    const currentAvailabilityGraphRequest = this.state.availabilityGraphRequest;
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.location.delivery = e.deliveryLocation;
    if (e.deliveryLocation) {
      productBookingForm.location.delivery.label = e.deliveryLocation.name;
    }

    currentAvailabilityGraphRequest.location.delivery = e.deliveryLocation;
    await this.setState({
      availabilityGraphRequest: currentAvailabilityGraphRequest,
      availabilityGraph: [],
      productBookingForm,
    });
    this.getProduct();
    await this.updateAvailabilityGraph(productBookingForm.period.start);
  }

  async handleDropOffChange(e) {
    this.updateDateRangeAvailability("collection", !!e.collectionLocation);
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.location.collection = e.collectionLocation;
    const currentAvailabilityGraphRequest = this.state.availabilityGraphRequest;
    currentAvailabilityGraphRequest.location.collection = e.collectionLocation;
    await this.setState({
      availabilityGraphRequest: currentAvailabilityGraphRequest,
      availabilityGraph: [],
      productBookingForm,
    });
    await this.updateAvailabilityGraph(productBookingForm.period.start);
  }

  async setQty(value) {
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.qty = value;

    const availabilityGraphRequest = this.state.availabilityGraphRequest;
    availabilityGraphRequest.quantity = value;

    await this.setState({
      productBookingForm,
      availabilityGraph: [],
      availabilityGraphRequest
    });

    this.updateDateRangeAvailability("quantity", value);
    await this.updateAvailabilityGraph(productBookingForm.period.start);
  }

  async focusChange(dates) {
    const availabilityGraphRequest = this.state.availabilityGraphRequest;
    const productBookingForm = this.state.productBookingForm;

    if (dates.startDate && dates.endDate) {
      availabilityGraphRequest.period.start = dates.startDate;
      availabilityGraphRequest.period.end = dates.endDate;
    }
    productBookingForm.period.start = dates.startDate;
    productBookingForm.period.end = dates.endDate;
    await this.setState({
      availabilityGraphRequest,
      productBookingForm
    });

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
                onClick={() => this.props.closeModal()}
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
                        initialValues={{
                          bookingItem: this.state.productBookingForm.booking,
                          deliveryLocation: this.state.productBookingForm
                            .location.delivery,
                          collectionLocation: this.state.productBookingForm
                            .location.collection,
                          deliveryDate: this.state.productBookingForm.period
                            .start,
                          collectionDate: this.state.productBookingForm.period
                            .end,
                          qty: this.props.product.qty
                        }}
                        onSubmit={this.onSubmit.bind(this)}
                      >
                        {({ errors, setFieldValue }) => (
                          <Form>
                            <div>
                              <div className="bookingItem form-block mx-0 px-0">
                                <label htmlFor="bookingItem">
                                  Add to Booking
                                </label>
                                <Field
                                  options={this.state.bookingDropDown}
                                  name="bookingItem"
                                  placeholder="New Booking"
                                  value={this.state.productBookingForm.booking}
                                  setFieldValue={setFieldValue}
                                  component={CustomSelect}
                                  onSelect={this.setFormFromBooking.bind(this)}
                                  selectRef={ ref => (this.bookingSelectElement = ref)}
                                />
                              </div>
                              <div className="form-inline mx-0 px-0">
                                <div className="location form-block pr-1">
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
                                    onChange={e => this.handlePickupChange(e)}
                                    setFieldValue={setFieldValue}
                                    component={CustomSelect}
                                    selectRef={ ref => (this.deliveryLocationSelectElement = ref)}
                                  />
                                </div>
                                <div className="location form-block ml-2 px-0">
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
                                    onChange={e => this.handleDropOffChange(e)}
                                    setFieldValue={setFieldValue}
                                    component={CustomSelect}
                                    selectRef={ ref => (this.collectionLocationSelectElement = ref)}
                                  />
                                </div>
                              </div>
                              <div className="date form-block search-form-wrap px-0">
                                <div className="label-wrapper">
                                  <label htmlFor="collectionDateRange uppercase">
                                    Pick-up Date
                                  </label>
                                  <label htmlFor="collectionDateRange uppercase">
                                    Drop-off Date
                                  </label>
                                </div>

                                <Field
                                  disabled={
                                    !(
                                      this.state.dateRangeAvailability
                                        .collection &&
                                      this.state.dateRangeAvailability
                                        .delivery &&
                                      this.state.dateRangeAvailability
                                        .booking &&
                                      this.state.dateRangeAvailability
                                        .quantity > 0
                                    )
                                  }
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
                                  availabilityGraph={
                                    this.state.availabilityGraph
                                  }
                                  updateVisibleMonth={this.updateAvailabilityGraph.bind(
                                    this
                                  )}
                                  rangeCheck={
                                    this.rangeCheck.bind(this)
                                  }
                                  loadingAvailabilityGraph={
                                    this.state.loadingAvailabilityGraph
                                  }
                                  focusChange={
                                    this.focusChange.bind(this)
                                  }
                                  selectRef={ ref => (this.datePickerSelectElement = ref)}
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
                                      selectRef={ ref => (this.quantityInputElement = ref)}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <button
                                    disabled={!this.state.loadingAvailabilityGraph ? false : true}
                                    className={!this.state.loadingAvailabilityGraph && _.isEmpty(errors) ? "search-button-full" : "search-button-full disabled"}
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
        <div
          className="col-md-5 equal-height-columns"
          style={{ background: "white" }}
        >
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

const mapStateToProps = ({
  locationReducer,
  localSearchReducer,
  searchReducer
}) => {
  return {
    locationReducer,
    localSearchReducer,
    searchReducer
  };
};

export default connect(mapStateToProps, {
  setProductOptionalAccessories,
  setCart,
})(ProductBookingForm);
