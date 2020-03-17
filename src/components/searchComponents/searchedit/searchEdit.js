import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from '../../formComponents/datepicker/datepicker';
import CustomSelect from '../../formComponents/select/customSelect';
import searchEditValidation from './searchEditValidation';
import LocalStorageUtil from "../../../utils/localStorageUtil";

class SearchEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      initialValues: {},
      setup: false
    };
    this.deliveryLocationSelectElement = React.createRef();
    this.collectionLocationSelectElement = React.createRef();
    this.bookingSelectElement = React.createRef();
  }

  async componentDidMount() {
    this.setState({
      locations: this.props.locationReducer.selectboxLocations,
    });
    const bookingDropDown = await this.setUpCartItemSelection();
    await this.setState({ bookingDropDown });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationReducer.selectboxLocations !== this.props.locationReducer.selectboxLocations) {
      this.setState({
        locations: this.props.locationReducer.selectboxLocations
      });
    }

    const { searchReducer } = this.props;
    const { search } = searchReducer;

    if (this.state.bookingDropDown 
      && this.bookingSelectElement.updateStateValue 
      && search.deliveryLocation
      && search.collectionLocation
      && search.deliveryDate
      && search.collectionDate
      && !this.state.setup) {
      const matchBookingCriteria = this.state.bookingDropDown.find(x =>
        x.location.delivery.id === search.deliveryLocation.id &&
        x.location.collection.id === search.collectionLocation.id &&
        x.period.start === search.deliveryDate && 
        x.period.end === search.collectionDate,
      );
      if (matchBookingCriteria) {
        this.bookingSelectElement.updateStateValue(matchBookingCriteria);
        this.props.onChange({ bookingOnly: matchBookingCriteria });
        this.setState({ setup: true });
      }
    }
  }

  async setUpCartItemSelection() {
    const cart = LocalStorageUtil.getCart() || [];
    await this.setState({ cart });
    const bookingDropDown = [];
    cart.forEach((cartItem) => {
      const dropDownItem = cartItem;
      dropDownItem.id = cartItem.id;
      dropDownItem.label = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`;
      dropDownItem.name = `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`;
      dropDownItem.value = {
        id: cartItem.id,
        name: `${cartItem.location.delivery.name} - ${cartItem.location.collection.name}`
      };
      bookingDropDown.push(dropDownItem);
    });
    return bookingDropDown;
  }

  handleSubmit() { }

  changeBooking(obj) {
    const { cart } = this.state;
    const { locationReducer } = this.props;
    const booking = cart.find(x => x.id === obj.booking.id);
    
    this.deliveryLocationSelectElement.updateStateValue(locationReducer.selectboxLocations.find(x => x.id === booking.location.delivery.id));
    this.collectionLocationSelectElement.updateStateValue(locationReducer.selectboxLocations.find(x => x.id === booking.location.collection.id));

    if (this.props.onChange) {
      this.props.onChange(obj);
    }
  }

  changeDateRange(obj) {
    if (this.props.onChange) {
      this.props.onChange(obj);
    }
  }

  render() {
    const {
      validation, label, onChange,
    } = this.props;
    const submitForm = this.handleSubmit;
    if (!isEmpty(this.state.locations) && this.props.searchReducer.search) {
      return (
        <div className="topSearch">
          <Formik
            validationSchema={validation ? searchEditValidation : undefined}
            enableReinitialize
            initialValues={{
              booking: this.props.searchReducer.search.booking,
              deliveryLocation: this.props.searchReducer.search.deliveryLocation,
              collectionLocation: this.props.searchReducer.search.collectionLocation,
              collectionDate: this.props.searchReducer.search.collectionDate,
              deliveryDate: this.props.searchReducer.search.deliveryDate
            }}
            onSubmit={submitForm || undefined}
          >
            {({
              setFieldValue,
            }) => (
              <Form>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-inline">
                      <div className="edit-row">
                          <label htmlFor="booking">Booking</label>
                          <Field
                            placeholder="Booking"
                            onChange={this.changeBooking.bind(this)}
                            value={this.props.searchReducer.search.booking}
                            options={this.state.bookingDropDown}
                            name="booking"
                            setFieldValue={setFieldValue}
                            component={CustomSelect}
                            selectRef={ ref => (this.bookingSelectElement = ref)}/>
                        </div>
                        <div className="edit-row">
                          <label htmlFor="deliveryLocation">
                            Pick up
                          </label>
                          <Field
                            placeholder="Pick up"
                            onChange={
                              onChange || null
                            }
                            value={this.props.searchReducer.search.deliveryLocation}
                            options={this.state.locations}
                            name="deliveryLocation"
                            setFieldValue={setFieldValue}
                            component={CustomSelect} 
                            selectRef={ ref => (this.deliveryLocationSelectElement = ref)}/>
                        </div>
                        <div className="edit-row">
                          <label htmlFor="collectionLocation">Return</label>
                          <Field
                            placeholder="Return"
                            onChange={
                              onChange || null
                            }
                            value={this.props.searchReducer.search.collectionLocation}
                            options={this.state.locations}
                            name="collectionLocation"
                            setFieldValue={setFieldValue}
                            component={CustomSelect} 
                            selectRef={ ref => (this.collectionLocationSelectElement = ref)}/>
                        </div>
                        <div className="other-wrapper" style={{paddingTop: "27px", paddingRight: "20px"}}><img className="img-fluid" style={{maxHeight: "26px"}} src="static/images/arrow-right.png" /></div>
                        <div className="other-wrapper">
                          <div className="label-wrapper">
                            <label htmlFor="collectionDateRange">From</label>
                            <label htmlFor="collectionDateRange">To</label>
                          </div>
                          <Field
                            validation={validation}
                            placeholders={['Pick up', 'Return']}
                            onChange={this.changeDateRange.bind(this)}
                            startDate={this.props.searchReducer.search.deliveryDate}
                            endDate={this.props.searchReducer.search.collectionDate}
                            name="collectionDate"
                            placeholder="Return"
                            setFieldValue={setFieldValue}
                            component={DatePicker} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      );
    } return null;
  }
}

const mapStateToProps = ({ searchReducer, locationReducer }) => {
  return {
    searchReducer,
    locationReducer
  };
};

export default connect(
  mapStateToProps, { }
)(SearchEdit);
