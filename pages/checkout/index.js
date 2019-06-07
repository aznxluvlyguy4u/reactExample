import moment from 'moment';
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import './checkout.scss';
import SelectionOverview from '../../components/checkout/selectionOverview/selectionOverview';
import FinalCheckout from '../../components/checkout/finalCheckout/finalCheckout';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [], loading: true,
    };
  }

  async componentDidMount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === undefined || !isEmpty(cart)) {
      const newcart = cart.filter(item => moment(item.period.start) < moment());
      if (newcart === undefined || !isEmpty(newcart)) {
        localStorage.setItem('cart', JSON.stringify(newcart));
        try {
          const response = await checkCartAvailability(newcart);
          this.setState({ cart: response.data, loading: false });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    console.log(this.state.cart);
    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <h1>Checkout Process</h1>
          <div className="flex-row">
            <SelectionOverview cart={this.state.cart} />
            <div className="support">
              <h2>Support</h2>
              <span>For any questions or assistance with your order please do not hesitate to contact us.</span>
            </div>
          </div>
          <FinalCheckout cart={this.state.cart} />
        </div>
      </Default>
    );
  }
}

export default CheckoutPage;
