import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateSearchKeyword,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchDeliveryDate,
  updateSearchCollectionDate
 } from '../../../actions/searchActions';
import searchReducer from '../../../reducers/searchReducer';
import locationReducer from '../../../reducers/locationReducer';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
import { generateSearchQueryParameterString } from '../../../utils/queryparams';
import DatePicker from '../../formComponents/datepicker/datepicker';
import CustomSelect from '../../formComponents/select/customSelect';
import CustomInputComponent from '../../signup/customInputComponent';
import searchValidation from './searchValidation';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      initialValues: {}
    };
  }

  componentDidMount() {
    this.setState({
      locations: this.props.locationReducer.selectboxLocations,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationReducer.selectboxLocations !== this.props.locationReducer.selectboxLocations) {
      this.setState({
        locations: this.props.locationReducer.selectboxLocations
      })
    }
  }

  onSubmit(values) {
    // this.props.updateSearch(values);
    const params = generateSearchQueryParameterString();
    Router.push({ pathname: '/search', query: params });
  }

  render() {
    return (
      <div>
      <Formik
        validationSchema={searchValidation}
        enableReinitialize
        initialValues={{
          keyword: this.props.searchReducer.search.keyword,
          deliveryLocation: this.props.searchReducer.search.deliveryLocation,
          collectionLocation: this.props.searchReducer.search.collectionLocation,
          collectionDate: this.props.searchReducer.search.collectionDate,
          deliveryDate: this.props.searchReducer.search.deliveryDate
        }}
        onSubmit={this.onSubmit.bind(this)}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div>
              <div className="keyword form-block">
                <label htmlFor="keyword">I am looking for</label>
                <Field
                  name="keyword"
                  onChange={
                    (e) =>{
                      this.props.updateSearchKeyword(e.target.value)
                    }
                  }
                  placeholder="Anything, anywhere..."
                  component={CustomInputComponent} />
              </div>
              <div className="form-inline">
                <div className="location form-block">
                  <label htmlFor="deliveryLocation">Pick up Location</label>
                  <Field
                    options={this.props.locationReducer.selectboxLocations}
                    onChange={
                      (e) =>{
                        this.props.updateSearchDeliveryLocation({
                          label: e.deliveryLocation.name,
                          value: e.deliveryLocation
                        })
                        if (values.collectionLocation === "") {
                          this.props.updateSearchCollectionLocation({
                            label: e.deliveryLocation.name,
                            value: e.deliveryLocation
                          })
                        }
                      }
                    }
                    name="deliveryLocation"
                    placeholder="Location"
                    value={this.props.searchReducer.search.deliveryLocation}
                    setFieldValue={setFieldValue}
                    component={CustomSelect} />
                </div>
                <div className="location form-block">
                  <label htmlFor="collectionLocation">Drop off Location</label>
                  <Field
                    options={this.props.locationReducer.selectboxLocations}
                    onChange={
                      (e) =>{
                        this.props.updateSearchCollectionLocation({
                          label: e.collectionLocation.name,
                          value: e.collectionLocation
                        })
                      }
                    }
                    name="collectionLocation"
                    placeholder="Location"
                    value={this.props.searchReducer.search.collectionLocation}
                    setFieldValue={setFieldValue}
                    component={CustomSelect} />
                </div>
              </div>
              <div className="date form-block">
                <div className="label-wrapper">
                  <label htmlFor="collectionDateRange">Pick up Date</label>
                  <label htmlFor="collectionDateRange">Drop off Date</label>
                </div>
                <Field
                  placeholders={['Date', 'Date']}
                  onChange={
                    (e) =>{
                      if (e.hasOwnProperty('deliveryDate')) {
                        this.props.updateSearchDeliveryDate(e.deliveryDate);
                      }
                      if (e.hasOwnProperty('collectionDate')) {
                        this.props.updateSearchCollectionDate(e.collectionDate);
                      }
                    }
                  }
                  name="collectionDate" placeholder="Date"
                  setFieldValue={setFieldValue}
                  startDate={this.props.searchReducer.search.deliveryDate}
                  endDate={this.props.searchReducer.search.collectionDate}
                  component={DatePicker} />
              </div>
              <button
                className="search-button-full"
                type="submit"
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      </div>
    );
  }
}

const mapStateToProps = ({ searchReducer, locationReducer }) => {
  return {
    searchReducer,
    locationReducer
  };
};

export default connect(mapStateToProps, {
  updateSearchKeyword,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchDeliveryDate,
  updateSearchCollectionDate
})(SearchForm);
