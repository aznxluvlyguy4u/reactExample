import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import searchReducer from '../../../reducers/searchReducer';
import locationReducer from '../../../reducers/locationReducer';
import { transformLocationData } from '../../../utils/data/countryDataUtil';
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

  handleSubmit() { }

  render() {
    const {
      validation, label, onChange,
    } = this.props;
    const submitForm = this.handleSubmit;
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
                      {label ? <label htmlFor="deliveryLocation">Pick up Location</label> : null}
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
                      {label ? <label htmlFor="deliveryLocation">Drop off Location</label> : null}
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
                         <label htmlFor="collectionDateRange">Pick up Date</label>
                          <label htmlFor="collectionDateRange">Drop off Date</label>
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
