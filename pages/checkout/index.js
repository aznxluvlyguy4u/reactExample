import moment from 'moment';
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import './checkout.scss';
import SelectionOverview from '../../components/checkout/selectionOverview/selectionOverview';
import FinalCheckout from '../../components/checkout/finalCheckout/finalCheckout';
import UnavailableItems from '../../components/checkout/unavailableItems/unavailableItems';
import Loader from '../../components/loader';
import cartReducer from '../../reducers/cartReducer';
import { connect } from 'react-redux';
import { setCartCount } from '../../actions/cartActions';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [], loading: false, totalPrice: 0,
    };
    this.removeItem = this.removeItem.bind(this);
    this.emptyCart = this.emptyCart.bind(this);
  }

  async componentDidMount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === undefined || !isEmpty(cart)) {
      const newcart = cart;
      // const newcart = cart.map((item) => {
      //   if (moment(item.period.start) > moment()) {
      //     return item;
      //   }
      //   return null;
      // });
      if (cart === undefined || !isEmpty(newcart)) {
        localStorage.setItem('cart', JSON.stringify(newcart));
        try {
          this.setState({ loading: true });
          const response = await checkCartAvailability(newcart);
          this.setState({ cart: response.data.products, loading: false, totalPrice: response.data.totalPrice });
          localStorage.setItem('cart', JSON.stringify(response.data.products));
          this.props.dispatch(setCartCount(response.data.products.length));
        } catch (error) {
          this.setState({ loading: false });
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
    this.props.dispatch(setCartCount(removedlist.length));
    const obj = this.state.cart.find(item => item.uuid === uuid);
    this.setState({ totalPrice: this.state.totalPrice - parseFloat(obj.totalPrice) });
  }

  emptyCart() {
    const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');
    this.setState({ cart: unavailableData });
    localStorage.setItem('cart', JSON.stringify(unavailableData));
    this.props.dispatch(setCartCount(unavailableData.length));
    this.setState({ totalPrice: '0.00' });
  }

  render() {
    const finalCheckoutData = this.state.cart.filter(item => item.availabilityState !== 'NOT_AVAILABLE');
    const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');

    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper checkout">
          <h1>Checkout Process</h1>
          <div className="flex-row">
            <SelectionOverview totalPrice={this.state.totalPrice} cart={finalCheckoutData} />
            <div className="support">
              <h2>Support</h2>
              <span>
For any questions or assistance with your order please do not hesitate to contact us. You can give us a
                <a href="tel:+6494461709"> call </a>
or send an
                <a href="mailto:someone@example.com"> email </a>
              </span>
            </div>
          </div>
          {!isEmpty(unavailableData) ? <UnavailableItems removeItem={this.removeItem} cart={unavailableData} /> : null}
          {!isEmpty(finalCheckoutData) ? <FinalCheckout emptyCart={this.emptyCart} removeItem={this.removeItem} cart={finalCheckoutData} /> : null}
        </div>
        {this.state.loading ? <Loader /> : null}
      </Default>
    );
  }
}

export default connect(cartReducer)(CheckoutPage);
