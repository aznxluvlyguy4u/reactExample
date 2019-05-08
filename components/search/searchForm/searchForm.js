import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchForm.scss';
import searchReducer from '../../../reducers/searchReducer';
import CustomSelect from '../../select';
// import {
//   continents, countries, languages, languagesAll,
// } from 'countries-list';
// import { transformCountryData } from '../../../utils/data/countryDataUtil';
import { getLocations } from '../../../utils/rest/requests/locations';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
import { NullCheckQueryParams, toQueryParameterString } from '../../../utils/queryparams';
import DatePicker from '../../datepicker/datepicker';

const initialValues = {
  keyword: '',
  deliveryLocation: '',
  collectionLocation: '',
  collectionDate: '',
  deliveryDate: '',
};

function onSubmit(values) {
  console.log(values);
  const params = toQueryParameterString(NullCheckQueryParams(values));
  if (values.keyword === '' && values.collectionLocation === '' && values.deliveryLocation === '' && values.collectionDate === '' && values.deliveryDate === '') {
    Router.push('/search');
    return;
  }
  Router.push(`/search${params}`);
}

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  async componentDidMount() {
    await this.retrieveLocations();
    // const options = transformCountryData(countries);
    // console.log(options);
  }

  async retrieveLocations() {
    try {
      const response = await getLocations();
      this.setState({ locations: transformLocationData(response.data) });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={setFieldValue => (
          <Form>
            <div>
              <div className="keyword form-block">
                <label htmlFor="keyword">I am looking for</label>
                <Field name="keyword" placeholder="Anything, anywhere" component={CustomInputComponent} />
              </div>
              <div className="form-inline">
                <div className="location form-block">
                  <label htmlFor="deliveryLocation">Delivery Location</label>
                  <Field options={this.state.locations} name="deliveryLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
                <div className="location form-block">
                  <label htmlFor="collectionLocation">Collection Location</label>
                  <Field options={this.state.locations} name="collectionLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
              </div>
              <div className="date form-block">
                <div className="label-wrapper">
                  <label htmlFor="collectionDateRange">Collection Date</label>
                  <label htmlFor="collectionDateRange">Pickup Date</label>
                </div>

                <Field name="collectionDate" placeholder="Date" setFieldValue={setFieldValue} component={DatePicker} />
              </div>
              <button className="search-button-full" type="submit">Search</button>
            </div>
          </Form>
        )}
      />
    );
  }
}

export default SearchForm;
