import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchInput.scss';
import searchReducer from '../../../reducers/searchReducer';

const initialValues = {
  keyword: '',
};

function onSubmit(values) {
  if (values.keyword === '') {
    Router.push('/search');
    return;
  }
  Router.push(`/search?keyword=${values.keyword}`);
}

class SearchInput extends Component {
  state = { }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={() => (
          <Form>
            <div className="search-wrapper">
              <div className="search form-block">
                <Field name="keyword" value={this.props.searchReducer ? this.props.searchReducer.search.keyword : null} placeholder="Anything, anytime, any place" component={CustomInputComponent} />
              </div>
              <button className="search-button" type="submit"><i className="icon-search" /></button>
            </div>
          </Form>
        )}
      />
    );
  }
}

export default connect(searchReducer)(SearchInput);
