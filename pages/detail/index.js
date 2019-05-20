import React, { Component } from 'react';
import Default from '../../layouts/default';
import './detail.scss';

const meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id),
    };
  }

  getProduct() {
    const { id } = this.props;
    console.log(id);
  }

  render() {
    return (
      <Default nav="fixed" search meta={meta}>
        <div>bla</div>
      </Default>
    );
  }
}

export default DetailPage;
