import moment from 'moment';
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import './checkout.scss';
import SelectionOverview from '../../components/checkout/selectionOverview/selectionOverview';
import FinalCheckout from '../../components/checkout/finalCheckout/finalCheckout';
import UnavailableItems from '../../components/checkout/unavailableItems/unavailableItems';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [], loading: true,
    };
    this.removeItem = this.removeItem.bind(this);
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
          localStorage.setItem('cart', JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
        }
      }
      // localStorage.removeItem('cart');
    } else {
      this.setState({ loading: false });
    }
  }

  removeItem(uuid) {
    const removedlist = this.state.cart.filter(item => item.uuid !== uuid);
    this.setState({ cart: removedlist });
    localStorage.setItem('cart', JSON.stringify(removedlist));
  }

  render() {
    const finalCheckoutData = this.state.cart.filter(item => item.availabilityState !== 'NOT_AVAILABLE');
    const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');

    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <h1>Checkout Process</h1>
          <div className="flex-row">
            <SelectionOverview cart={finalCheckoutData} />
            <div className="support">
              <h2>Support</h2>
              <span>For any questions or assistance with your order please do not hesitate to contact us.</span>
            </div>
          </div>
          {!isEmpty(unavailableData) ? <UnavailableItems removeItem={this.removeItem} cart={unavailableData} /> : null}
          {!isEmpty(finalCheckoutData) ? <FinalCheckout removeItem={this.removeItem} cart={finalCheckoutData} /> : null}
        </div>
      </Default>
    );
  }
}

export default CheckoutPage;
