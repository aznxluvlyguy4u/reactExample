import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { connect } from 'react-redux';
import CustomInputComponent from '../signup/customInputComponent';
import CustomSelect from '../select';
import DatePicker from '../datepicker/datepicker';
import searchReducer from '../../reducers/searchReducer';
import { getLocations } from '../../utils/rest/requests/locations';
import { transformLocationData } from '../../utils/data/countryDataUtil';
import './searchedit.scss';
import { updateSearchObject } from '../../actions/searchActions';
import { CreateQueryParams } from '../../utils/queryparams';
import Router from 'next/router';
import { isEmpty } from 'lodash';
import searchEditValidation from './searchEditValidation';


const initialValues = {
  deliveryLocation: '',
  collectionLocation: '',
  collectionDate: '',
  deliveryDate: '',
};

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
    this.props.dispatch(updateSearchObject(this.props.searchReducer.search, obj));
    const query = CreateQueryParams(this.props.searchReducer.search);
    Router.push({ pathname: '/search', query });
  }

  render() {
    const { locations } = this.state;
    if (!isEmpty(locations)) {
      return (
        <div className="searchedit">
          <Formik
            validationSchema={this.props.validation ? searchEditValidation : undefined}
            initialValues={{
              deliveryLocation: locations.find(x => x.value === parseInt(this.props.searchReducer.search.deliveryLocation)),
              collectionLocation: locations.find(x => x.value === parseInt(this.props.searchReducer.search.collectionLocation)),
              collectionDate: this.props.searchReducer.search.collectionDate,
              deliveryDate: this.props.searchReducer.search.deliveryDate,
            }}
            onSubmit={this.props.handleSubmit ? this.props.handleSubmit : undefined}
            render={setFieldValue => (
              <Form>
                <div>
                  <div className="form-inline">
                    <div className="edit-row">
                      {this.props.label ? <label htmlFor="deliveryLocation">Delivery Location</label> : null}
                      <Field placeholder="Delivery Location" onChange={this.props.onChange ? this.props.onChange : null} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.deliveryLocation))} options={locations} name="deliveryLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="edit-row">
                      {this.props.label ? <label htmlFor="deliveryLocation">Collection Location</label> : null}
                      <Field placeholder="Collection Location" onChange={this.props.onChange ? this.props.onChange : null} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.collectionLocation))} options={locations} name="collectionLocation" setFieldValue={setFieldValue} component={CustomSelect} />
                    </div>
                    <div className="other-wrapper">
                      {this.props.label ? (
                        <div className="label-wrapper">
                          <label htmlFor="collectionDateRange">Collection Date</label>
                          <label htmlFor="collectionDateRange">Delivery Date</label>
                        </div>
                      ) : null}
                      <Field validation={this.props.validation} placeholders={['Delivery Date', 'Collection Date']} onChange={this.props.onChange ? this.props.onChange : null} startDate={this.props.searchReducer.search.collectionDate} endDate={this.props.searchReducer.search.deliveryDate} name="collectionDate" placeholder="Delivery Date" setFieldValue={setFieldValue} component={DatePicker} />
                    </div>
                    {this.props.submit ? <button className="search-button-full" type="submit">Confirm Itinerary</button> : null}
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
