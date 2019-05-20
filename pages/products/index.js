import React, { Component } from 'react';
import Default from '../../layouts/default';

const meta = { title: 'Oceanpremium - Products', description: 'Index description' };

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (<Default nav="fixed" search meta={meta} />);
  }
}

export default ProductPage;
