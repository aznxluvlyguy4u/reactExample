import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearchKeyword } from '../../../actions/searchActions';
import searchReducer from '../../../reducers/searchReducer';
import { generateSearchQueryParameterString } from '../../../utils/queryparams';
import CustomInputComponent from '../../formComponents/customInputComponent/customInputComponent';

class SearchInput extends Component {

  onSubmit(values) {
    this.props.updateSearchKeyword(values.keyword)
    const params = generateSearchQueryParameterString();
    Router.push({ pathname: '/search', query: params });
  }

  render() {
    return (
      <Formik
        onSubmit={this.onSubmit.bind(this)}
        enableReinitialize
        initialValues={{
          keyword: this.props.searchReducer.search.keyword,
        }}

        render={() => (
          <Form>
            <div className="search-wrapper">
              <div className="search form-block">
                <Field
                  name="keyword"
                  placeholder="Anything, anytime, any place"
                  component={CustomInputComponent}
                />
              </div>
              <button className="search-button" type="submit"><i className="icon-search" /></button>
            </div>
          </Form>
        )}
      />
    );
  }
}

const mapStateToProps = ({ searchReducer }) => {
  return {
    searchReducer
  };
};

export default connect(mapStateToProps, { updateSearchKeyword })(SearchInput);

// SearchInput.propTypes = {
//   searchReducer: PropTypes.element.isRequired,
// };
