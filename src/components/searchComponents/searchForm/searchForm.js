import { Field, Form, Formik } from "formik";
import Router from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateSearchKeyword,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchDeliveryDate,
  updateSearchCollectionDate,
} from "../../../actions/searchActions";
import { generateSearchQueryParameterString } from "../../../utils/queryparams";
import DatePicker from "../../formComponents/datepicker/datepicker";
import CustomSelect from "../../formComponents/select/customSelect";
import CustomInputComponent from "../../formComponents/customInputComponent/customInputComponent";
import searchValidation from "./searchValidation";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      initialValues: {}
    };
  }

  componentDidMount() {
    this.setState({
      locations: this.props.locationReducer.selectboxLocations
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.locationReducer.selectboxLocations !==
      this.props.locationReducer.selectboxLocations
    ) {
      this.setState({
        locations: this.props.locationReducer.selectboxLocations
      });
    }
  }

  onSubmit(values) {
    // this.props.updateSearch(values);
    const params = generateSearchQueryParameterString();
    Router.push({ pathname: "/search", query: params });
  }

  handleDateChange = e => {
    if (e.hasOwnProperty("deliveryDate")) {
      this.props.updateSearchDeliveryDate(e.deliveryDate);
    }
    if (e.hasOwnProperty("collectionDate")) {
      this.props.updateSearchCollectionDate(e.collectionDate);
    }
  };

  render() {
    return (
      <div>
        <Formik
          validationSchema={searchValidation}
          enableReinitialize
          initialValues={{
            keyword: this.props.searchReducer.search.keyword,
            deliveryLocation: this.props.searchReducer.search.deliveryLocation,
            collectionLocation: this.props.searchReducer.search
              .collectionLocation,
            collectionDate: this.props.searchReducer.search.collectionDate,
            deliveryDate: this.props.searchReducer.search.deliveryDate
          }}
          onSubmit={this.onSubmit.bind(this)}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div>
                <div className="keyword form-block mx-0 px-0">
                  <label htmlFor="keyword">I am looking for</label>
                  <Field
                    name="keyword"
                    onChange={e => {
                      this.props.updateSearchKeyword(e.target.value);
                    }}
                    placeholder="Anything, anywhere..."
                    component={CustomInputComponent}
                  />
                </div>
                <div className="form-inline mx-0 px-0">
                  <div className="location form-block pr-1">
                    <label htmlFor="deliveryLocation">Pick up</label>
                    <Field
                      options={this.props.locationReducer.selectboxLocations}
                      onChange={e => {
                        if (!e.deliveryLocation) {
                          this.props.updateSearchDeliveryLocation(null);
                          return;
                        }

                        this.props.updateSearchDeliveryLocation({
                          label: e.deliveryLocation.name,
                          value: e.deliveryLocation
                        });
                        if (values.collectionLocation === "") {
                          this.props.updateSearchCollectionLocation({
                            label: e.deliveryLocation.name,
                            value: e.deliveryLocation
                          });
                        }
                      }}
                      name="deliveryLocation"
                      placeholder="Location"
                      value={this.props.searchReducer.search.deliveryLocation}
                      setFieldValue={setFieldValue}
                      component={CustomSelect}
                    />
                  </div>
                  <div className="location form-block ml-2 px-0">
                    <label htmlFor="collectionLocation">Return</label>
                    <Field
                      options={this.props.locationReducer.selectboxLocations}
                      onChange={e => {
                        if (!e.collectionLocation) {
                          this.props.updateSearchCollectionLocation(null);
                          return;
                        }

                        this.props.updateSearchCollectionLocation({
                          label: e.collectionLocation.name,
                          value: e.collectionLocation
                        });
                      }}
                      name="collectionLocation"
                      placeholder="Location"
                      value={this.props.searchReducer.search.collectionLocation}
                      setFieldValue={setFieldValue}
                      component={CustomSelect}
                    />
                  </div>
                </div>
                <div className="date form-block search-form-wrap px-0">
                  <div className="label-wrapper">
                    <label htmlFor="collectionDateRange">Pick up Date</label>
                    <label htmlFor="collectionDateRange">Return Date</label>
                  </div>
                  <Field
                    placeholders={["Date", "Date"]}
                    onChange={e => {
                      if (e.hasOwnProperty("deliveryDate")) {
                        this.props.updateSearchDeliveryDate(e.deliveryDate);
                      }
                      if (e.hasOwnProperty("collectionDate")) {
                        this.props.updateSearchCollectionDate(e.collectionDate);
                      }
                    }}
                    setFieldValue={setFieldValue}
                    name="collectionDate"
                    placeholder="Date"
                    startDate={this.props.searchReducer.search.deliveryDate}
                    endDate={this.props.searchReducer.search.collectionDate}
                    component={DatePicker}
                  />
                </div>
                <button className="search-button-full" type="submit">
                  Search
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = ({ searchReducer, locationReducer }) => {
  return {
    searchReducer,
    locationReducer
  };
};

export default connect(mapStateToProps, {
  updateSearchKeyword,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchDeliveryDate,
  updateSearchCollectionDate
})(SearchForm);
