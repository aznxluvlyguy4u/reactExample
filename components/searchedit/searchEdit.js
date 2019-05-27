import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearchObject } from '../../actions/searchActions';
import searchReducer from '../../reducers/searchReducer';
import { transformLocationData } from '../../utils/data/countryDataUtil';
import { CreateQueryParams } from '../../utils/queryparams';
import { getLocations } from '../../utils/rest/requests/locations';
import DatePicker from '../datepicker/datepicker';
import CustomSelect from '../select';
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
    dispatch(updateSearchObject(this.props.searchReducer.search, obj));
    const query = CreateQueryParams(this.props.searchReducer.search);
    Router.push({ pathname: '/search', query });
  }

  render() {
    const {
      validation, handleSubmit, label, onChange, submit
    } = this.props;
    const { locations } = this.state;
    if (!isEmpty(locations)) {
      return (
        <div className="searchedit">
          <Formik
            validationSchema={validation ? searchEditValidation : undefined}
            initialValues={{
              deliveryLocation: locations.find(x => x.value === parseInt(this.props.searchReducer.search.deliveryLocation)),
              collectionLocation: locations.find(x => x.value === parseInt(this.props.searchReducer.search.collectionLocation)),
              collectionDate: this.props.searchReducer.search.collectionDate,
              deliveryDate: this.props.searchReducer.search.deliveryDate,
            }}
            onSubmit={handleSubmit || undefined}
            render={setFieldValue => (
              <Form>
                <div>
                  <div className="form-inline">
                    <div className="edit-row">
                      {label ? <label htmlFor="deliveryLocation">Delivery Location</label> : null}
                      <Field placeholder="Delivery Location" onChange={onChange || null} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.deliveryLocation))} options={locations} name="deliveryLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="edit-row">
                      {label ? <label htmlFor="deliveryLocation">Collection Location</label> : null}
                      <Field placeholder="Collection Location" onChange={onChange || null} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.collectionLocation))} options={locations} name="collectionLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="other-wrapper">
                      {label ? (
                        <div className="label-wrapper">
                          <label htmlFor="collectionDateRange">Collection Date</label>
                          <label htmlFor="collectionDateRange">Delivery Date</label>
                        </div>
                      ) : null}
                      <Field validation={validation} placeholders={['Delivery Date', 'Collection Date']} onChange={onChange || null} startDate={this.props.searchReducer.search.collectionDate} endDate={this.props.searchReducer.search.deliveryDate} name="collectionDate" placeholder="Delivery Date" setFieldValue={setFieldValue} component={DatePicker} />
                    </div>
                    {submit ? <button className="search-button-full" type="submit">Confirm Itinerary</button> : null}
                  </div>
                </div>
              </Form>
            )}
          />
        </div>
      );
    } return null;
  }
}

export default connect(searchReducer)(SearchEdit);
