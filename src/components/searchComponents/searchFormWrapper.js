import React, { Component } from 'react';
import SearchForm from './searchForm/searchForm';

export default class SearchFormWrapper extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="searchform-wrapper">
              <h1>Water toys anytime anywhere</h1>
              <h3>Discover the best water toys for your next adventure on the high seas.</h3>
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
