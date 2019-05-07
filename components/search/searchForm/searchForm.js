import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchForm.scss';
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

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={() => (
          <Form>
            <div>
              <div className="keyword form-block">
                <label htmlFor="keyword">I am looking for</label>
                <Field name="keyword" placeholder="Anything, anywhere" component={CustomInputComponent} />
              </div>
              <button className="search-button-full" type="submit">Search</button>
            </div>
          </Form>
        )}
      />
    );
  }
}

export default SearchForm;
