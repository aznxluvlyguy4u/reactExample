import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearchObject } from '../../../actions/searchActions';
import searchReducer from '../../../reducers/searchReducer';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
import { CreateQueryParams } from '../../../utils/queryparams';
import { getLocations } from '../../../utils/rest/requests/locations';
import DatePicker from '../../formComponents/datepicker/datepicker';
import CustomSelect from '../../formComponents/select/customSelect';
import './searchedit.scss';
import searchEditValidation from './searchEditValidation';

class SearchEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
    };
    this.initialValues = {
      deliveryLocation: '',
      collectionLocation: '',
      collectionDate: '',
      deliveryDate: '',
    };
    this.mergeObj = this.mergeObj.bind(this);
    this.clickPrevious = this.clickPrevious.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.retrieveLocations();
  }

  async retrieveLocations() {
    try {
      const response = await getLocations();
      this.setState({ locations: transformLocationData(response.data) });
    } catch (error) {
      console.log(error);
    }
  }

  mergeObj(obj) {
    const { dispatch } = this.props;
    // dispatch(updateSearchObject(this.props.searchReducer.search, obj));
    const query = CreateQueryParams(this.props.searchReducer.search);
    Router.push({ pathname: '/search', query });
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
    this.props._next();
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
      validation, label, onChange, submit,
    } = this.props;
    const submitForm = this.handleSubmit;
    const { locations } = this.state;
    const currentStep = this.props.currentStep || this.props.currentStep;
    if (!isEmpty(locations) && this.props.searchReducer.search) {
      return (
        <div className="searchedit">
          <Formik
            validationSchema={validation ? searchEditValidation : undefined}
            initialValues={{
              deliveryLocation: this.props.searchReducer.search.deliveryLocation ? {label: this.props.searchReducer.search.deliveryLocation.name, value: this.props.searchReducer.search.deliveryLocation} : '',
              collectionLocation:this.props.searchReducer.search.collectionLocation ? {label: this.props.searchReducer.search.collectionLocation.name, value: this.props.searchReducer.search.collectionLocation} : '',
              collectionDate: this.props.searchReducer.search.collectionDate,
              deliveryDate: this.props.searchReducer.search.deliveryDate,
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
                      <Field placeholder="Delivery Location" onChange={onChange || null} value={this.props.searchReducer.search.deliveryLocation ? {label: this.props.searchReducer.search.deliveryLocation.name, value: this.props.searchReducer.search.deliveryLocation} : null} options={locations} name="deliveryLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="edit-row">
                      {label ? <label htmlFor="deliveryLocation">Collection Location</label> : null}
                      <Field placeholder="Collection Location" onChange={onChange || null} value={this.props.searchReducer.search.collectionLocation ? {label: this.props.searchReducer.search.collectionLocation.name, value: this.props.searchReducer.search.collectionLocation} : null} options={locations} name="collectionLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="other-wrapper">
                      {label ? (
                        <div className="label-wrapper">
                         <label htmlFor="collectionDateRange">Delivery Date</label>
                          <label htmlFor="collectionDateRange">Collection Date</label>
                        </div>
                      ) : null}
                      <Field validation={validation} placeholders={['Delivery Date', 'Collection Date']} onChange={onChange || null} startDate={this.props.searchReducer.search.deliveryDate} endDate={this.props.searchReducer.search.collectionDate} name="collectionDate" placeholder="Delivery Date" setFieldValue={setFieldValue} component={DatePicker} />
                    </div>
                    {submit ? this.previousButton(this.props.currentStep) : null}
                    {submit ? this.nextButton(this.props.currentStep, handleSubmit) : null}
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

export default connect(searchReducer)(SearchEdit);
