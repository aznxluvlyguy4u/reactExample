import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { connect } from 'react-redux';
import CustomInputComponent from '../signup/customInputComponent';
import CustomSelect from '../select';
import DatePicker from '../datepicker/datepicker';
import searchReducer from '../../reducers/searchReducer';
import { getLocations } from '../../utils/rest/requests/locations';
import { transformLocationData } from '../../utils/data/countryDataUtil';

const initialValues = {
  deliveryLocation: '',
  collectionLocation: '',
  collectionDate: '',
  deliveryDate: '',
};

class SearchEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
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

  render() {
    const { locations } = this.state;
    console.log(this.props.searchReducer.search.startDate);
    console.log(this.props.searchReducer.search.endDate);
    return (
      <Formik
        initialValues={initialValues}
        render={setFieldValue => (
          <Form>
            <div>
              <div className="form-inline">
                <div className="location form-block">
                  <Field onChange={() => console.log('test')} value={locations.find(x => x.id === this.props.searchReducer.deliveryLocation)} options={locations} name="deliveryLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
                <div className="location form-block">
                  <Field onChange={() => console.log('test')} value={locations.find(x => x.id === this.props.searchReducer.collectionLocation)} options={locations} name="collectionLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                </div>
                <div className="date form-block">
                  <Field onChange={() => console.log('test')} startDate={this.props.searchReducer.search.collectionDate} endDate={this.props.searchReducer.search.deliveryDate} name="collectionDate" placeholder="Date" setFieldValue={setFieldValue} component={DatePicker} />
                </div>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

export default connect(searchReducer)(SearchEdit);
