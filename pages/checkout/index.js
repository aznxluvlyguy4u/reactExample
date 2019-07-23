import moment from 'moment';
import React, { Component } from 'react';
// import { isEmpty } from 'lodash';
import classnames from 'classnames';

import { connect } from 'react-redux';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import SelectionOverview from '../../components/checkout/selectionOverview/selectionOverview';
// import FinalCheckout from '../../components/checkout/finalCheckout/finalCheckout';
// import UnavailableItems from '../../components/checkout/unavailableItems/unavailableItems';
// import Loader from '../../components/loader';
// import cartReducer from '../../reducers/cartReducer';
// import { setCartCount } from '../../actions/cartActions';
// import { handleGeneralError } from '../../utils/rest/error/toastHandler';
import { LocalStorageUtil } from '../../utils/LocalStorageUtil';
import Counter from '../../components/detailSubViews/counter';

import {
  // updateLocalSearch,
  updateLocalSearchProductQuantity,
  // setSelectedProduct,
  // setProductAccessories,
  // setProductMandatoryAccessories,
  // setProductOptionalAccessories,
  // setProductConfigurations,
  // setTotalSteps,
  // setCurrentStep
} from '../../actions/localSearchActions';
import {
  // updateCart,
  addToCart,
  removeFromCart
} from '../../actions/cartActions';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateProductQuantity = this.updateProductQuantity.bind(this);
    this.updateAccessoryQuantity = this.updateAccessoryQuantity.bind(this);
  }

  dayCount(item) {
    const collectionDate = moment(item.collectionDate);
    const deliveryDate = moment(item.deliveryDate);
    return collectionDate.diff(deliveryDate, 'days');
  }

  collapse(item) {
    if(item.collapsed) {
      item.collapsed = !item.collapsed;
    } else {
      item.collapsed = true;
    }
    this.forceUpdate();
  }

  async componentDidMount() {
    const cart = await this.props.cartReducer.items.map(item => { item = item.orderRequest; return item});
    console.log('orderRequests = ', cart);

    setTimeout(() => {
      if (cart.length > 0) {
        let response = checkCartAvailability(cart);
        console.log('response = ', response);
      }
    }, 500 )

    // do api call to availability check

    // const cart = JSON.parse(localStorage.getItem('cart'));
    // if (cart === undefined || !isEmpty(cart)) {
    //   const newcart = cart;
    //   // const newcart = cart.map((item) => {
    //   //   if (moment(item.period.start) > moment()) {
    //   //     return item;
    //   //   }
    //   //   return null;
    //   // });
    //   if (cart === undefined || !isEmpty(newcart)) {
    //     localStorage.setItem('cart', JSON.stringify(newcart));
    //     try {
    //       this.setState({ loading: true });
    //       const response = await checkCartAvailability(newcart);
    //       this.setState({ cart: response.data.products, loading: false, totalPrice: response.data.totalPrice });
    //       localStorage.setItem('cart', JSON.stringify(response.data.products));
    //       this.props.dispatch(setCartCount(response.data.products.length));
    //     } catch (error) {
    //       this.setState({ loading: false });
    //       handleGeneralError(error);
    //     }
    //   }
    //   // localStorage.removeItem('cart');
    // } else {
    //   this.setState({ loading: false });
    // }
  }

  removeItem(uuid) {
    // const removedlist = this.state.cart.filter(item => item.uuid !== uuid);
    // this.setState({ cart: removedlist });
    // localStorage.setItem('cart', JSON.stringify(removedlist));
    // this.props.dispatch(setCartCount(removedlist.length));
    // const obj = this.state.cart.find(item => item.uuid === uuid);
    // if (obj.availabilityState !== 'NOT_AVAILABLE') {
    //   this.setState({ totalPrice: this.state.totalPrice - parseFloat(obj.totalPrice) });
    // }

    // LocalStorageUtil.addToCart(uuid);
  }

  emptyCart() {
    // const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');
    // this.setState({ cart: unavailableData });
    // localStorage.setItem('cart', JSON.stringify(unavailableData));
    // this.props.dispatch(setCartCount(unavailableData.length));
    // this.setState({ totalPrice: '0.00' });
  }

  updateProductQuantity(result) {
    result.item.productQuantity = result.quantity;
    this.setState({ state: this.state });
  }

  updateAccessoryQuantity(result) {
    result.item.quantity = result.quantity;
    this.setState({ state: this.state });
  }

  removeProductFromCart(item) {
    this.props.removeFromCart(item);
  }


  removeAccessoryFromCart(accessory) {
    // this.props.removeFromCart()
  }

  render() {
    // const finalCheckoutData = this.state.cart.filter(item => item.availabilityState !== 'NOT_AVAILABLE');
    // const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');

    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper checkout">
          <h1>Final Checkout</h1>
            <div className="cart-item heading">
              <div className="row">
                <div className="column heading">
                </div>
                <div className="column heading">
                  product
                </div>
                <div className="column heading">
                  QTY
                </div>
                <div className="column heading">
                  Price
                </div>
                <div className="column heading">
                  <div className="date-wrapper">
                    <div className="date-element">
                      <span>Pick up</span>
                    </div>
                    <div className="date-element">
                      {/* <img src="/static/images/arrow.png" height="7" width="40" /> */}
                    </div>
                    <div className="date-element">
                      <span>Drop off</span>
                    </div>
                  </div>
                </div>

                <div className="column heading">
                  Availability
                </div>
                <div className="column heading">
                </div>
              </div>
            </div>


            {this.props.cartReducer.items.map(item => (
              <div className="cart-item">
                <div className="product">
                  <div className="row">
                    <div className="column">
                      <button onClick={(e) => {this.removeProductFromCart(item)}}>
                        <i className="icon-x"></i>
                      </button>
                    </div>
                    <div className="column">
                      <small>{item.selectedProduct.name}</small>
                      <br />
                      <div
                        style={{
                          backgroundImage: `url(${item.selectedProduct.images[0].thumbnailUrl})`,
                          backgroundSize: 'cover',
                          width: '100px',
                          height: '70px'
                        }}
                      />
                    </div>
                    <div className="column">
                      <Counter item={item} updateQuantity={this.updateProductQuantity} quantity={item.productQuantity}/>
                    </div>
                    <div className="column">
                      {parseFloat(item.selectedProduct.rates[0].price * item.productQuantity * this. dayCount(item)).toFixed(2)}
                    </div>
                    <div className="column">
                      <div className="date-wrapper">
                        <div className="date-element">
                          <span>{moment(item.deliveryDate).format('DD.MM.YYYY')}</span>
                          <span>{item.deliveryLocation.label}</span>
                        </div>
                        <div className="date-element">
                          <img src="/static/images/arrow.png" height="7" width="40" />
                        </div>
                        <div className="date-element">
                          <span>{moment(item.collectionDate).format('DD.MM.YYYY')}</span>
                          <span>{item.collectionLocation.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="column">
                      icon availability
                    </div>
                    <div className="column">
                      <small>small text about availability</small>
                    </div>
                    <div className="column">
                      <button className="yellow-chevron" onClick={(e) => {
                        this.collapse(item)
                      }}>
                        <i className={classnames({
                          'icon-down-open': item.collapsed === null || item.collapsed === undefined || item.collapsed === false,
                          'icon-up-open': item.collapsed && item.collapsed === true
                        })}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={classnames({
                  'accessories': true,
                  'open': item.collapsed && item.collapsed === true
                 })}>
                  {item.productOptionalAccessories.map(accessory => (
                    <div className="row">
                      <div className="column">
                        <div className="column">
                          <button onClick={(e) => {}}>
                            <i className="icon-x"></i>
                          </button>
                        </div>
                      </div>
                      <div className="column">
                        {accessory.name}
                      </div>
                      <div className="column">
                        <Counter item={accessory} updateQuantity={this.updateAccessoryQuantity} quantity={accessory.quantity}/>

                      </div>
                      <div className="column">
                        {parseFloat(accessory.rates[0].price * accessory.quantity * this. dayCount(item)).toFixed(2)}
                      </div>
                      <div className="column">

                      </div>
                      <div className="column">

                      </div>
                      <div className="column">
                        icon availability
                      </div>
                      <div className="column">
                        <small>Optional Accessory</small>
                      </div>
                    </div>)
                  )}
                </div>
              </div>
            ))}
          </div>

      </Default>
    );
  }
}

const mapStateToProps = ({ localSearchReducer, cartReducer }) => {
  return {
    localSearchReducer,
    cartReducer
  };
};

export default connect(
  mapStateToProps, {
    updateLocalSearchProductQuantity,
    addToCart,
    removeFromCart
  }
)(CheckoutPage);
