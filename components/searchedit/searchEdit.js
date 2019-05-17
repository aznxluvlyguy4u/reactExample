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
import {updateSearchObject} from '../../actions/searchActions'

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

  mergeObj(obj){
    this.props.dispatch(updateSearchObject(this.props.searchReducer.search, obj))
  }

  render() {
    const { locations } = this.state;
    return (
      <div className="searchedit">
        <Formik
          initialValues={initialValues}
          render={setFieldValue => (
            <Form>
              <div>
                <div className="form-inline">
                  <div className="edit-row">
                    <Field onChange={() => console.log('test')} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.deliveryLocation))} options={locations} name="deliveryLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                  </div>
                  <div className="edit-row">
                    <Field onChange={() => console.log('test')} value={locations.find(x => x.value === parseInt(this.props.searchReducer.search.collectionLocation))} options={locations} name="collectionLocation" placeholder="Location" setFieldValue={setFieldValue} component={CustomSelect} />
                  </div>
                  <div>
                    <Field onChange={this.mergeObj} startDate={this.props.searchReducer.search.collectionDate} endDate={this.props.searchReducer.search.deliveryDate} name="collectionDate" placeholder="Date" setFieldValue={setFieldValue} component={DatePicker} />
                  </div>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default connect(searchReducer)(SearchEdit);
