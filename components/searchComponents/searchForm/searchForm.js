import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearch } from '../../../actions/searchActions';
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

  onSubmit(values) {
    this.props.updateSearch(values);
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
        {({ setFieldValue }) => (
          <Form>
            <div>
              <div className="keyword form-block">
                <label htmlFor="keyword">I am looking for</label>
                <Field
                  name="keyword"
                  placeholder="Anything, anywhere..."
                  component={CustomInputComponent} />
              </div>
              <div className="form-inline">
                <div className="location form-block">
                  <label htmlFor="deliveryLocation">Delivery Location</label>
                  <Field
                    options={transformLocationData(this.props.locationReducer.locations)}
                    name="deliveryLocation"
                    placeholder="Location"
                    value={this.props.searchReducer.search.deliveryLocation}
                    setFieldValue={setFieldValue}
                    component={CustomSelect} />
                </div>
                <div className="location form-block">
                  <label htmlFor="collectionLocation">Collection Location</label>
                  <Field
                    options={transformLocationData(this.props.locationReducer.locations)}
                    name="collectionLocation"
                    placeholder="Location"
                    value={this.props.searchReducer.search.collectionLocation}
                    setFieldValue={setFieldValue}
                    component={CustomSelect} />
                </div>
              </div>
              <div className="date form-block">
                <div className="label-wrapper">
                  <label htmlFor="collectionDateRange">Delivery Date</label>
                  <label htmlFor="collectionDateRange">Collection Date</label>
                </div>
                <Field
                  placeholders={['Date', 'Date']}
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

export default connect(mapStateToProps, { updateSearch })(SearchForm);
