import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
        <div className="topSearch">
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
              setFieldValue,
            }) => (
              <Form>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-inline">
                        <div className="edit-row">
                          <label htmlFor="deliveryLocation">Pick up</label>
                          <Field
                            placeholder="Pick up"
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
                            component={CustomSelect} />
                        </div>
                        <div className="other-wrapper">
                          <div className="label-wrapper">
                            <label htmlFor="collectionDateRange">From</label>
                            <label htmlFor="collectionDateRange">To</label>
                          </div>
                          <Field
                            validation={validation}
                            placeholders={['Pick up', 'Return']}
                            onChange={
                              onChange || null
                            }
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
