import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React from 'react';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchInput.scss';

const initialValues = {
  keyword: '',
};

function onSubmit(values) {
  Router.push(`/search?keyword=${values.keyword}`);
}

const SearchInput = () => (
  <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    render={() => (
      <Form>
        <div className="search-wrapper">
          <div className="search form-block">
            <Field name="keyword" placeholder="Anything, anytime, any place" component={CustomInputComponent} />
          </div>
          <button className="search-button" type="submit"><i className="icon-search" /></button>
        </div>
      </Form>
    )}
  />
);
export default SearchInput;
