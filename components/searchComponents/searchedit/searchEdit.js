import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
   updateSearch,
   updateSearchDeliveryLocation,
   updateSearchCollectionLocation,
   updateSearchDeliveryDate,
   updateSearchCollectionDate
} from '../../../actions/searchActions';
import searchReducer from '../../../reducers/searchReducer';
import locationReducer from '../../../reducers/locationReducer';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
import { CreateQueryParams } from '../../../utils/queryparams';
import DatePicker from '../../formComponents/datepicker/datepicker';
import CustomSelect from '../../formComponents/select/customSelect';
import searchEditValidation from './searchEditValidation';

class SearchEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      initialValues: {}
    };

    this.clickPrevious = this.clickPrevious.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      locations: transformLocationData(this.props.locationReducer.locations),
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationReducer.locations !== this.props.locationReducer.locations) {
      this.setState({
        locations: transformLocationData(this.props.locationReducer.locations)
      })
    }
  }

  clickPrevious() {
    this.props._prev();
  }

  previousButton(currentStep) {
    // If the current step is not 1, then render the "previous" button
    if (currentStep !== 1) {
      return (
        <button
          className="search-button-full"
          type="button"
          onClick={this.clickPrevious}
        >
        Previous
        </button>
      );
    }
    // ...else return nothing
    return null;
  }

  handleSubmit(values) {
    // this.props.dispatch(updateSearchObject(values, values));
    // this.props.updateSearch(values);
    // this.props._next();
  }

  nextButton(currentStep, handleSubmit) {
    if (currentStep < 3) {
      return (
        <button
          className="search-button-full"
          type="button"
          onClick={handleSubmit}
        >
        Confirm Itinerary
        </button>
      );
    }
    // ...else render nothing
    return null;
  }

  render() {
    const {
      validation, label, onChange,
    } = this.props;
    const submitForm = this.handleSubmit;
    const currentStep = this.props.currentStep || this.props.currentStep;
    if (!isEmpty(this.state.locations) && this.props.searchReducer.search) {
      return (
        <div className="searchedit">
          <Formik
            validationSchema={validation ? searchEditValidation : undefined}
            enableReinitialize
            initialValues={{
              deliveryLocation: this.props.searchReducer.search.deliveryLocation,
              collectionLocation: this.props.searchReducer.search.collectionLocation,
              collectionDate: this.props.searchReducer.search.collectionDate,
              deliveryDate: this.props.searchReducer.search.deliveryDate
            }}
            onSubmit={submitForm || undefined}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
            }) => (
              <Form>
                <div>
                  <div className="form-inline">
                    <div className="edit-row">
                      {label ? <label htmlFor="deliveryLocation">Delivery Location</label> : null}
                      <Field
                        placeholder="Delivery Location"
                        onChange={
                          onChange || null
                        }
                        value={this.props.searchReducer.search.deliveryLocation}
                        options={this.state.locations}
                        name="deliveryLocation"
                        setFieldValue={setFieldValue}
                        component={CustomSelect} />
                    </div>
                    <div className="edit-row">
                      {label ? <label htmlFor="deliveryLocation">Collection Location</label> : null}
                      <Field
                        placeholder="Collection Location"
                        onChange={
                          onChange || null
                        }
                        value={this.props.searchReducer.search.collectionLocation}
                        options={this.state.locations}
                        name="collectionLocation"
                        setFieldValue={setFieldValue}
                        component={CustomSelect} />
                    </div>
                    <div className="other-wrapper">
                      {label ? (
                        <div className="label-wrapper">
                         <label htmlFor="collectionDateRange">Delivery Date</label>
                          <label htmlFor="collectionDateRange">Collection Date</label>
                        </div>
                      ) : null}
                      <Field
                        validation={validation}
                        placeholders={['Delivery Date', 'Collection Date']}
                        onChange={
                          onChange || null
                        }
                        startDate={this.props.searchReducer.search.deliveryDate}
                        endDate={this.props.searchReducer.search.collectionDate}
                        name="collectionDate"
                        placeholder="Delivery Date"
                        setFieldValue={setFieldValue}
                        component={DatePicker} />
                    </div>
                    {/* {submit ? this.previousButton(this.props.currentStep) : null} */}
                    {/* {submit ? this.nextButton(this.props.currentStep, handleSubmit) : null} */}
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
  mapStateToProps, {
  updateSearch,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchDeliveryDate,
  updateSearchCollectionDate
 })(SearchEdit);
