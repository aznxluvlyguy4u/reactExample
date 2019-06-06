import moment from 'moment';
import React, { Component } from 'react';
import Default from '../../layouts/default';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log(JSON.parse(localStorage.getItem('cart')));
  }

  render() {
    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper" />
      </Default>
    );
  }
}

export default CheckoutPage;
