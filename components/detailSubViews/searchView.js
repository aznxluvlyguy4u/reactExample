import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import searchReducer from '../../reducers/searchReducer';
import locationReducer from '../../reducers/locationReducer';
import localSearchReducer from '../../reducers/localSearchReducer';
import { transformLocationData } from '../../utils/data/countryDataUtil';
import DatePicker from '../formComponents/datepicker/datepicker';
import CustomSelect from '../formComponents/select/customSelect';
import localSearchValidation from './searchViewValidation';
import ConfigurationModal from './configurationModal';
import {
  updateLocalSearch,
  updateLocalSearchDeliveryLocation,
  updateLocalSearchCollectionLocation,
  updateLocalSearchDeliveryDate,
  updateLocalSearchCollectionDate,
} from '../../actions/localSearchActions';
import Steps from './steps';

class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      modalIsOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      locations: transformLocationData(this.props.locationReducer.locations),
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationReducer.locations !== this.props.locationReducer.locations) {
      this.setState({
        locations: transformLocationData(this.props.locationReducer.locations)
      })
    }
  }

  toggleModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleSubmit(values) {
    this.props._next();
  }

  render() {
    const { modalIsOpen } = this.state;


    if (this.props.localSearchReducer.currentStep && this.props.localSearchReducer.currentStep !== 1) { // Prop: The current step
      return null;
    }


    const submitForm = this.handleSubmit;
    if (!isEmpty(this.state.locations) && this.props.localSearchReducer.search) {
      return (
        <div className={'active' ? 'form active' : 'form'}>
          <div className="titlewrapper">
            <h3>Select Dates & Locations</h3>
            <Steps />
          </div>

          <div className="searchedit">
            <Formik
              validationSchema={localSearchValidation}
              enableReinitialize
              initialValues={{
                deliveryLocation: this.props.localSearchReducer.search.deliveryLocation,
                collectionLocation: this.props.localSearchReducer.search.collectionLocation,
                collectionDate: this.props.localSearchReducer.search.collectionDate,
                deliveryDate: this.props.localSearchReducer.search.deliveryDate
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
                        <label htmlFor="deliveryLocation">Pick up Location</label>
                        <Field
                          placeholder="Delivery Location"
                          onChange={(e) => {
                              this.props.updateLocalSearchDeliveryLocation({
                                label: e.deliveryLocation.name,
                                value: e.deliveryLocation
                              })
                              if (values.collectionLocation === "") {
                                this.props.updateLocalSearchCollectionLocation({
                                  label: e.deliveryLocation.name,
                                  value: e.deliveryLocation
                                })
                              }
                            }
                          }
                          value={this.props.localSearchReducer.search.deliveryLocation}
                          options={this.state.locations}
                          name="deliveryLocation"
                          setFieldValue={setFieldValue}
                          component={CustomSelect} />
                      </div>
                      <div className="edit-row">
                        <label htmlFor="deliveryLocation">Drop off Location</label>
                        <Field
                          placeholder="Collection Location"
                          onChange={(e) => {
                              this.props.updateLocalSearchCollectionLocation({
                                label: e.collectionLocation.name,
                                value: e.collectionLocation
                              })
                            }
                          }
                          value={this.props.localSearchReducer.search.collectionLocation}
                          options={this.state.locations}
                          name="collectionLocation"
                          setFieldValue={setFieldValue}
                          component={CustomSelect} />
                      </div>
                      <div className="other-wrapper">

                          <div className="label-wrapper">
                            <label htmlFor="collectionDateRange">Pick up Date</label>
                            <label htmlFor="collectionDateRange">Drop off Date</label>
                          </div>
                        <Field
                          validation={true}
                          placeholders={['Delivery Date', 'Collection Date']}
                          onChange={(e) => {
                              if (e.hasOwnProperty('deliveryDate')) {
                                this.props.updateLocalSearchDeliveryDate(e.deliveryDate);
                              }
                              if (e.hasOwnProperty('collectionDate')) {
                                this.props.updateLocalSearchCollectionDate(e.collectionDate);
                              }
                            }
                          }
                          startDate={this.props.localSearchReducer.search.deliveryDate}
                          endDate={this.props.localSearchReducer.search.collectionDate}
                          name="collectionDate"
                          placeholder="Delivery Date"
                          setFieldValue={setFieldValue}
                          component={DatePicker} />
                      </div>
                      <button className="search-button-full" type="submit">Next</button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* {!isEmpty(data.configurations) ? (
          <button type="button" onClick={this.toggleModal} className="configure">
            <i className="icon-cog" />
                Advanced Configuration
          </button>
        ) : null} */}
        {/* <ConfigurationModal configurationsstate={this.props.configurationsstate} onChangeConfiguration={this.props.onChangeConfiguration} quantity={1} configurations={data.configurations} closeModal={this.closeModal} modalIsOpen={modalIsOpen} /> */}

        </div>
      );
    } return null;
  }
}

const mapStateToProps = ({ searchReducer, locationReducer, localSearchReducer }) => {
  return {
    searchReducer,
    locationReducer,
    localSearchReducer
  };
};

export default connect(
  mapStateToProps, {
    updateLocalSearch,
    updateLocalSearchDeliveryLocation,
    updateLocalSearchCollectionLocation,
    updateLocalSearchDeliveryDate,
    updateLocalSearchCollectionDate,
  }
)(SearchView);
