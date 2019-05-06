import { Field, Form, Formik } from 'formik';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomInputComponent from '../../signup/customInputComponent';
import './searchInput.scss';
import searchReducer from '../../../reducers/searchReducer';
import { updateSearch } from '../../../actions/searchActions';

const initialValues = {
  keyword: '',
};

class SearchInput extends Component {
  state = { search: '' }

  async componentDidMount() {
    this.setState({
      search: await this.props.searchReducer.search.keyword,
    });
  }

  onSubmit(values) {
    if (this.state.search === '') {
      Router.push('/search');
      return;
    }
    Router.push(`/search?keyword=${this.state.search}`);
  }

  onChangeValue(value) {
    // const { dispatch } = this.props;
    this.setState({ search: value });
    // dispatch(updateSearch({ keyword: value }));
  }

  render() {
    console.log(this.props);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onSubmit.bind(this)}
        render={() => (
          <Form>
            <div className="search-wrapper">
              <div className="search form-block">
                <Field name="keyword" value={this.state.search} placeholder="Anything, anytime, any place" component={CustomInputComponent} />
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
