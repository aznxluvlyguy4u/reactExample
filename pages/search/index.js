import React, { Component } from 'react';
import Default from '../../layouts/default';
import '../index/index.scss';
import { getProducts } from '../../utils/rest/requests/products';

const meta = { title: 'Oceanpremium - Test', description: 'Index description' };

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  static async getInitialProps({ query }) {
    console.log('SLUG', query.slug);
    return {};
  }

  componentDidMount() {
    // try {
    //   getProducts();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    return (<Default nav="fixed" search meta={meta} />);
  }
}

export default SearchPage;
