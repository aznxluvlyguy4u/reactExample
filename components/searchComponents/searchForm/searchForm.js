import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearch } from '../../../actions/searchActions';
import searchReducer from '../../../reducers/searchReducer';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
import { NullCheckQueryParams, CreateQueryParams } from '../../../utils/queryparams';
import { getLocations } from '../../../utils/rest/requests/locations';
import DatePicker from '../../formComponents/datepicker/datepicker';
import CustomSelect from '../../formComponents/select/customSelect';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchForm.scss';
import searchValidation from './searchValidation';
import { handleGeneralError } from '../../../utils/rest/error/toastHandler';

const initialValues = {
  keyword: '',
  deliveryLocation: '',
  collectionLocation: '',
  collectionDate: '',
  deliveryDate: '',
};

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

  onSubmit(values) {
    console.log(values);
    const { dispatch } = this.props;
    const params = NullCheckQueryParams(values);
    // dispatch(updateSearch(values, values));

    CreateQueryParams(values);
    if (values.keyword === '' && values.collectionLocation === '' && values.deliveryLocation === '' && values.collectionDate === '' && values.deliveryDate === '') {
      Router.push('/search');
      return;
    }
    Router.push({ pathname: '/search', query: params });
  }

  async retrieveLocations() {
    try {
      const response = await getLocations();
      this.setState({ locations: transformLocationData(response.data) });
    } catch (error) {
      handleGeneralError();
      console.log(error);
    }
  }

  render() {
    const { locations } = this.state;
    return (
      <Formik
        validationSchema={searchValidation}
        initialValues={initialValues}
        onSubmit={this.onSubmit.bind(this)}
      >
        {({ setFieldValue }) => (
          <Form>
            <div>
              <div className="keyword form-block">
                <label htmlFor="keyword">I am looking for</label>
                <Field name="keyword" placeholder="Anything, anywhere..." component={CustomInputComponent} />
              </div>
              <div className="form-inline">
                <div className="location form-block">
                  <label htmlFor="deliveryLocation">Delivery Location</label>
                  <Field onChange={() => console.log('test')} options={locations} name="deliveryLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
                <div className="location form-block">
                  <label htmlFor="collectionLocation">Collection Location</label>
                  <Field onChange={() => console.log('test')} options={locations} name="collectionLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
              </div>
              <div className="date form-block">
                <div className="label-wrapper">
                  <label htmlFor="collectionDateRange">Delivery Date</label>
                  <label htmlFor="collectionDateRange">Collection Date</label>
                </div>

                <Field placeholders={['Date', 'Date']} onChange={() => console.log('test')} name="collectionDate" placeholder="Date" setFieldValue={setFieldValue} component={DatePicker} />
              </div>
              <button className="search-button-full" type="submit">Search</button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default connect(searchReducer)(SearchForm);
