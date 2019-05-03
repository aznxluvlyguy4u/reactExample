import React, { useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import * as FontAwesome from 'react-icons/lib/fa';
import { Formik, Form, Field } from 'formik';
import Router from 'next/router';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchInput.scss';

const initialValues = {
  keyword: '',
};

export default class SearchInput extends React.Component {
  onSubmit(values) {
    Router.push(`/search?keyword=${values.keyword}`);
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        render={({
          errors, touched, validateForm, setFieldValue,
        }) => (
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
  }
}
