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

    const bookingDropDown = this.setUpCartItemSelection(cart);
    this.state = {
      dateRangeAvailability: {
        collection: false,
        delivery: false,
        booking: false,
        quantity: true
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
        quantity: 1,
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

  componentDidMount() {
    if (this.props.searchReducer.search.deliveryLocation) {
      const productBookingForm = this.state.productBookingForm;
      productBookingForm.location.delivery = this.props.searchReducer.search.deliveryLocation;

      const dateRangeAvailability = this.state.dateRangeAvailability;
      dateRangeAvailability.delivery = true;

      setTimeout(() => {
        this.setState({
          productBookingForm,
          dateRangeAvailability
        });
      }, 100);
    }

    if (this.props.searchReducer.search.collectionLocation) {
      const productBookingForm = this.state.productBookingForm;
      productBookingForm.location.collection = this.props.searchReducer.search.collectionLocation;

      const dateRangeAvailability = this.state.dateRangeAvailability;
      dateRangeAvailability.collection = true;

      setTimeout(() => {
        this.setState({
          productBookingForm,
          dateRangeAvailability
        });
      }, 100);
    }
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
      }
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

      cartItem.location.delivery = cartItem.location.delivery;
      cartItem.location.delivery.value = cartItem.location.delivery;
      cartItem.location.delivery.label = cartItem.location.delivery.name;

      cartItem.location.collection = cartItem.location.collection;
      cartItem.location.collection.value = cartItem.location.collection;
      cartItem.location.collection.label = cartItem.location.collection.name;

      productBookingForm.location = cartItem.location;
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

      if (availabilityGraphRequest.location.delivery.name)
        this.updateDateRangeAvailability("delivery", true);
      if (availabilityGraphRequest.location.collection.name)
        this.updateDateRangeAvailability("collection", true);

      const start = moment.utc(new Date(cartItem.period.start).setDate(1));
      const end = moment(start).add(1, "M");
      availabilityGraphRequest.period = { start, end };
      this.calculateAvailabilityGraph(availabilityGraphRequest);
      this.setState({ accessories: bookingAccessories });
      this.setState({ productBookingForm, availabilityGraphRequest });
    }
  }

  setQty(value) {
    this.updateDateRangeAvailability("quantity", value);
    const productBookingForm = this.state.productBookingForm;
    productBookingForm.qty = value;

    const currentAvailabilityGraphRequest = this.state.availabilityGraphRequest;
    currentAvailabilityGraphRequest.quantity = value;

    this.setState({
      productBookingForm,
      availabilityGraphRequest: currentAvailabilityGraphRequest
    });

    this.calculateAvailabilityGraph(currentAvailabilityGraphRequest);
  }

  async updateDateRangeAvailability(field, elementVal) {
    const dateRangeAvailability = this.state.dateRangeAvailability;
    dateRangeAvailability[field] = false;
    if (elementVal) {
      dateRangeAvailability[field] = true;
    }
    await this.setState({ dateRangeAvailability });
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

  calculateAvailabilityGraph(availabilityGraphRequest) {
    availabilityGraphRequest.period.start =
      moment
        .utc(
          availabilityGraphRequest.period.start ||
            this.state.productBookingForm.period.start
        )
        .format("YYYY-MM-DDTHH:mm:ss") + ".000+0000";
    availabilityGraphRequest.period.end =
      moment
        .utc(
          availabilityGraphRequest.period.end ||
            this.state.productBookingForm.period.end
        )
        .format("YYYY-MM-DDTHH:mm:ss") + ".000+0000";

    if (availabilityGraphRequest.quantity < 1) return;
    if (availabilityGraphRequest.location == null) return;
    if (availabilityGraphRequest.location.delivery == null) return;
    if (availabilityGraphRequest.location.collection == null) return;

    this.setState({
      loadingAvailabilityGraph: true
    });

    checkAvailabilityGraph(availabilityGraphRequest)
      .then(res => {
        if (!res.data) return;
        if (!res.data.availabilityGraph) return;

        const productBookingForm = this.state.productBookingForm;
        const startAvailable = res.data.availabilityGraph.find(
          x =>
            moment(x.date).isSame(
              moment(availabilityGraphRequest.period.start),
              "day"
            ) && x.available
        );
        const endAvailable = res.data.availabilityGraph.find(
          x =>
            moment(x.date).isSame(availabilityGraphRequest.period.end, "day") &&
            x.available
        );
        if (!startAvailable) productBookingForm.period.start = null;
        if (!endAvailable) productBookingForm.period.end = null;

        productBookingForm.location.collection =
          productBookingForm.location.collection ||
          this.props.searchReducer.search.collectionLocation;
        productBookingForm.location.delivery =
          productBookingForm.location.delivery ||
          this.props.searchReducer.search.deliveryLocation;

        this.setState({
          productBookingForm,
          availabilityGraph: res.data.availabilityGraph,
          loadingAvailabilityGraph: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loadingAvailabilityGraph: false
        });
      });
  }

  updateAvailabilityGraph(date) {
    this.setState({
      loadingAvailabilityGraph: true
    });
    const start = moment.utc(date);
    const end = moment(start).add(1, "M");
    const availabilityGraphRequest = this.state.availabilityGraphRequest;
    availabilityGraphRequest.period = { start, end };
    this.calculateAvailabilityGraph(availabilityGraphRequest);
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
                        //enableReinitialize
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
                                    onChange={e => {
                                      this.updateDateRangeAvailability(
                                        "delivery",
                                        e.deliveryLocation
                                      );
                                      const currentAvailabilityGraphRequest = this
                                        .state.availabilityGraphRequest;
                                      currentAvailabilityGraphRequest.location.delivery =
                                        e.deliveryLocation;

                                      currentAvailabilityGraphRequest.period.start = this
                                        .state.productBookingForm.period.start
                                        ? moment.utc(
                                            new Date(
                                              this.state.productBookingForm.period.start
                                            ).setDate(1)
                                          )
                                        : currentAvailabilityGraphRequest.period
                                            .start;
                                      currentAvailabilityGraphRequest.period.end = this
                                        .state.productBookingForm.period.end
                                        ? moment
                                            .utc(
                                              new Date(
                                                this.state.productBookingForm.period.end
                                              )
                                            )
                                            .add(1, "M")
                                        : currentAvailabilityGraphRequest.period
                                            .end;
                                      this.setState({
                                        availabilityGraphRequest: currentAvailabilityGraphRequest
                                      });

                                      this.calculateAvailabilityGraph(
                                        currentAvailabilityGraphRequest
                                      );
                                    }}
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
                                    onChange={e => {
                                      this.updateDateRangeAvailability(
                                        "collection",
                                        e.collectionLocation
                                      );
                                      const currentAvailabilityGraphRequest = this
                                        .state.availabilityGraphRequest;
                                      currentAvailabilityGraphRequest.location.collection =
                                        e.collectionLocation;

                                      currentAvailabilityGraphRequest.period.start = this
                                        .state.productBookingForm.period.start
                                        ? moment.utc(
                                            new Date(
                                              this.state.productBookingForm.period.start
                                            ).setDate(1)
                                          )
                                        : currentAvailabilityGraphRequest.period
                                            .start;
                                      currentAvailabilityGraphRequest.period.end = this
                                        .state.productBookingForm.period.end
                                        ? moment
                                            .utc(
                                              new Date(
                                                this.state.productBookingForm.period.end
                                              )
                                            )
                                            .add(1, "M")
                                        : this.state.productBookingForm.period
                                            .end;
                                      this.setState({
                                        availabilityGraphRequest: currentAvailabilityGraphRequest
                                      });

                                      this.calculateAvailabilityGraph(
                                        currentAvailabilityGraphRequest
                                      );
                                    }}
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
                                  onChange={e => {
                                    const currentAvailabilityGraphRequest = this
                                      .state.availabilityGraphRequest;
                                    if (e.deliveryDate) {
                                      currentAvailabilityGraphRequest.period.start = moment.utc(
                                        new Date(e.deliveryDate).setDate(1)
                                      );
                                    }

                                    if (e.collectionDate) {
                                      currentAvailabilityGraphRequest.period.end = moment
                                        .utc(new Date(e.collectionDate))
                                        .add(1, "M");
                                    }

                                    this.setState({
                                      availabilityGraphRequest: currentAvailabilityGraphRequest
                                    });

                                    this.calculateAvailabilityGraph(
                                      currentAvailabilityGraphRequest
                                    );
                                  }}
                                  availabilityGraph={
                                    this.state.availabilityGraph
                                  }
                                  updateVisibleMonth={this.updateAvailabilityGraph.bind(
                                    this
                                  )}
                                  loadingAvailabilityGraph={
                                    this.state.loadingAvailabilityGraph
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
  setCart
})(ProductBookingForm);
