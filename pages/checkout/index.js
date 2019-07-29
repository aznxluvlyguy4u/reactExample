import moment from 'moment';
import React, { Component, Fragment } from 'react';
import Router from 'next/router';

import classnames from 'classnames';
import Modal from 'react-modal';
import OrderForm from '../../components/checkout/orderForm/orderForm';
import PlaceOrderRequest from '../../utils/mapping/products/placeOrderRequest';
import { orderCartItems } from '../../utils/rest/requests/orders';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';

import { connect } from 'react-redux';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import SelectionOverview from '../../components/checkout/selectionOverview/selectionOverview';
import Loader from '../../components/loader';
import { emptyCart } from '../../actions/cartActions';
import { LocalStorageUtil } from '../../utils/LocalStorageUtil';
import Counter from '../../components/detailSubViews/counter';
import OrderRequest from '../../utils/mapping/products/orderRequest';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

import {
  addToCart,
  removeFromCart
} from '../../actions/cartActions';

class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      modalIsOpen: false,
      loading: false,
      orderFailed: false,
      orderSuccess: false
    };

    this.updateProductQuantity = this.updateProductQuantity.bind(this);
    this.updateAccessoryQuantity = this.updateAccessoryQuantity.bind(this);
    this.returnWarningMessage = this.returnWarningMessage.bind(this);
  }

  dayCount(item) {
    const collectionDate = moment(item.period.end);
    const deliveryDate = moment(item.period.start);
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

  async getOrderRequsts() {
    return Promise.all(this.props.cartReducer.items.map(item => { item = item.orderRequest; return item}));
  }

  async componentDidUpdate(prevProps) {

  }

  async componentDidMount() {
    if(this.props.cartReducer.items.length > 0) {
      this.setState({ loading: true });

      const orderRequest = new OrderRequest().returnOrderRequest();
      if (orderRequest.length > 0) {
        let response = await checkCartAvailability(orderRequest);
        this.setState({
          products: response.data.products,
          loading: false
        })
      }
    }

    // const cart = await this.props.cartReducer.items.map(item => { item = item.orderRequest; return item});
    // const cart = await this.getOrderRequsts();
    // console.log('orderRequests = ', cart);

    // // setTimeout(() => {
    //   if (cart.length > 0) {
    //     let response = await checkCartAvailability(cart);

    //     console.log('response = ', response);
    //     this.setState({
    //       products: response.data.products
    //     })
    //   }
    // // }, 500 )

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

  returnWarningMessage(item) {
    if (item) {
      switch (item.availabilityState) {
        case 'AVAILABLE_BUT_DELAYED':
          return (
            <div className="warning-message">
          Items are available but might not reach selected Delivery location on time. Please contact/call the office to arrange a dedicated delivery on-board’
            </div>
          );
        case 'AVAILABLE_BUT_ACCESSORY_NOT_AVAILABLE':
          return (
            <div className="warning-message">
          Items are available but not all accesories are available. Please contact/call the office to arrange a solution’
            </div>
          );
          case 'NOT_AVAILABLE':
            return (
              <div className="warning-message">
                This item is unfortunately no longer available at your chosen time frame
              </div>
            )
        default:
          return null;
      }
    }
  }

  returnAvailabilityIcon(item) {
    // switch (item.availabilityState) {
    //   case 'AVAILABLE':
    //     return <img height="20" width="20" src="/static/images/available.png" />;
    //   case 'AVAILABLE_BUT_DELAYED':
    //     return <img height="20" width="20" src="/static/images/available.png" />;
    //   case 'AVAILABLE_BUT_ACCESSORY_NOT_AVAILABLE':
    //       return <img height="20" width="20" src="/static/images/available.png" />;
    //   case 'NOT_AVAILABLE':
    //     return <img height="20" width="20" src="/static/images/unavailable.png" />;
    // }
  }

  returnAvailabilityIcon(item) {
    if (item.quantityAvailable === 0) {
      return <img height="20" width="20" src="/static/images/unavailable.png" />
    }

    if (item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return 'WARNING.'
    }

    if (item.quantityAvailable !== 0 && item.quantity <= item.quantityAvailable) {
      return <img height="20" width="20" src="/static/images/available.png" />
    }
  }

  calculateTotalAccessoires(accessories) {
    // const { accessories } = this.props;
    let price = 0;
    accessories.map(item => price += this.dayCount(item)  * Number(item.rates[0].price) * item.quantity);
    return price;
  }

  calculateTotalPrice() {
    let productPrice = 0;
    let accessoryPrice = 0;
    this.state.products.map(product => {
      productPrice += this.dayCount(product) * Number(product.rates[0].price) * product.quantity
      accessoryPrice += this.calculateTotalAccessoires(product.accessories)
    });
    // alert(productPrice);
    return productPrice + accessoryPrice;
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

  // emptyCart() {
  //   // const unavailableData = this.state.cart.filter(item => item.availabilityState === 'NOT_AVAILABLE');
  //   // this.setState({ cart: unavailableData });
  //   // localStorage.setItem('cart', JSON.stringify(unavailableData));
  //   // this.props.dispatch(setCartCount(unavailableData.length));
  //   // this.setState({ totalPrice: '0.00' });
  // }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  updateProductQuantity(result) {
    result.item.quantity = result.quantity;
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

  requestReservation = (values) => {
    const request = new PlaceOrderRequest(this.state.products, values).returnOrder();
    try {
      this.setState({ loading: true });
      const response = orderCartItems(request);
      this.props.emptyCart();
      localStorage.setItem('cart', []);

      this.closeModal();
      this.setState({ loading: false });
      this.setState({
        orderSuccess: true
      })
    } catch (error) {
      this.setState({ loading: false });
      this.setState({
        orderFailure: true
      })
      handleGeneralError(error);
    }
  }

  quantityText(item) {
    if(item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return (
        `Only ${item.quantityAvailable} are available! Would you like to change the Selected Quantity? <br />`
      )
    }
  }

  checkStoreText(item) {
    if (item.stock.stores.alternative.length > 0 && item.stock.stores.alternative.length === item.quantityAvailable) {
      // alleen available in alternative store dus extra fee
      return '<br />Items need to be shipped from further away. An extra transport fee will apply'
    }
    if (item.stock.stores.gray.length > 0 && item.stock.stores.gray.length === item.quantityAvailable) {
      // alleen available in grey store dus extra fee
      return '<br />Items need to be shipped from further away. An extra transport fee will apply'
    }
    if (item.stock.stores.native.length > 0 && item.stock.stores.gray.length === item.quantityAvailable) {
      // alleen available in native store dus goed
    }
    if (item.stock.stores.newItems.length > 0 && item.stock.stores.newItems.length === item.quantityAvailable) {
      // alleen available in newItems store dus mogelijk extra fee
      return 'Items need to be shipped from further away. An extra transport fee will apply'
    }
  }

  setQuantityToAvailableQuantity(item) {
    item.quantity = item.quantityAvailable;
    this.setState({
      state: this.state
    });
  }

  resetQuantityButton(item) {
    if(item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return (
        <a
          href="#"
          className="button-border"
          onClick={(e) => {this.setQuantityToAvailableQuantity(item)}}>
          Yes
        </a>
      )
    } else {
      return null
    }
  }

  closeSuccessModal = () => {
    this.setState({
      orderSuccess: false
    });
    Router.push({ pathname: '/' });
  }

  closeFailedModal = () => {
    this.setState({
      orderFailed: false
    })
  }

  render() {
    return (
      <Default nav="fixed" search meta={{ title: 'checkout page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper checkout">
          <h1>Final Checkout</h1>
          {!this.state.loading && this.props.cartReducer.items.length > 0 ?
          <Fragment>
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

            {this.state.products.map((item, index) => (
              <div className="cart-item" key={index}>
                <div className="product">
                  <div className="row">
                    <div className="column">
                      <button
                        onClick={(e) => {this.removeProductFromCart(item)}}>
                        <i className="icon-x"></i>
                      </button>
                    </div>
                    <div className="column">
                      <small>{item.name}</small>
                      <br />
                      <div
                        style={{
                          backgroundImage: `url(${item.images[0].thumbnailUrl})`,
                          backgroundSize: 'cover',
                          width: '100px',
                          height: '70px'
                        }}
                      />
                    </div>
                    <div className="column">
                      <Counter item={item} updateQuantity={this.updateProductQuantity} quantity={item.quantity}/>
                    </div>
                    <div className="column">
                      €{parseFloat(Number(item.rates[0].price) * item.quantity * this.dayCount(item)).toFixed(2)}
                    </div>
                    <div className="column">
                      <div className="date-wrapper">
                        <div className="date-element">
                          <span>{moment(item.period.start).format('DD.MM.YYYY')}</span>
                          <span>{item.location.delivery.name}</span>
                        </div>
                        <div className="date-element">
                          <img src="/static/images/arrow.png" height="7" width="40" />
                        </div>
                        <div className="date-element">
                          <span>{moment(item.period.end).format('DD.MM.YYYY')}</span>
                          <span>{item.location.collection.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="column center">
                      {this.returnAvailabilityIcon(item)}
                    </div>
                    <div className="column">
                      <small>
                        {this.returnWarningMessage(item)}
                        <span dangerouslySetInnerHTML={{ __html: this.quantityText(item) }} />
                        {this.resetQuantityButton(item)}
                        <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(item) }} />
                      </small>
                    </div>
                    <div className="column">
                      <button className="yellow-chevron" onClick={(e) => {
                        this.collapse(item)
                      }}>
                        <i className={classnames({
                          'icon-down-open': item.collapsed && item.collapsed === true,
                          'icon-up-open': item.collapsed === null || item.collapsed === undefined || item.collapsed === false
                        })}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className={classnames({
                  'accessories': true,
                  'open': item.collapsed === null || item.collapsed === undefined || item.collapsed === false
                 })}>
                  {item.accessories.map((accessory, index) => (
                    <div className="row" key={index} style={
                      accessory.quantityAvailable === 0 ? {background: '#eee', color: '#bbb'} : null
                    }>
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
                        €{parseFloat(Number(accessory.rates[0].price) * accessory.quantity * this. dayCount(item)).toFixed(2)}
                      </div>
                      <div className="column">

                      </div>
                      <div className="column center">
                        {this.returnAvailabilityIcon(accessory)}
                      </div>
                      <div className="column">
                        <small>
                          {this.returnWarningMessage(accessory)}
                          <span dangerouslySetInnerHTML={{ __html: this.quantityText(accessory) }} />
                          {this.resetQuantityButton(accessory)}
                          <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(accessory) }} />
                        </small>
                      </div>

                      <div className="column">
                        <small>Optional Accessory</small>
                      </div>
                    </div>)
                  )}
                </div>
              </div>
            ))}

           {/* <div className="cost-extras">
              <div className="row">
                <div className="column">
                  <h3>Total Rental Fee (excl. VAT)</h3>
                </div>
                <div className="column">
                  <h3>€ PRICE</h3>
                </div>
              </div>
              <div c lassName="row">
                <div className="column">
                  <p>Delivery Costs</p>
                </div>
                <div className="column">
                  to be determined at final booking
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <p>A security deposit is going te be charged by credit card</p>
                </div>
                <div className="column">
                  € PRICE
                </div>
              </div>
            </div> */}
            <div className="cost-total">
              <div className="row">
                <div className="column">
                  <h3>Total Fee (excl. VAT)</h3>
                </div>
                <div className="column">
                  <h3>€ {parseFloat(this.calculateTotalPrice().toFixed(2))}</h3>
                </div>
              </div>
              <div className="row">
                <div className="column">

                </div>
                <div className="column">
                  <a
                    className="button-border right"
                    onClick={(e) => {
                      this.openModal()
                    }}
                  >
                    Request Reservation
                  </a>
                </div>
              </div>
            </div>
            </Fragment> : null}
            {this.state.loading ? <Loader /> : null}
          </div>

          {this.state.orderSuccess &&
            <Modal
              isOpen={this.state.orderSuccess}
              shouldCloseOnOverlayClick={false}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeSuccessModal}
              style={customStyles}
            >
              <h1>Reservation Request Sent</h1>
              <p>Thanks for your inquiry! We will get back to you as quickly as possible±!</p>
              <p>Please check your Email inbox for the details</p>
              <a
                className="button-border fullwidth"
                onClick={(e) => {
                  this.closeSuccessModal()
                }}>Done
              </a>
              {this.state.loading ? <Loader /> : null}
            </Modal>
          }

          {this.state.orderFailed &&
            <Modal
              isOpen={this.state.orderFailed}
              shouldCloseOnOverlayClick={false}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeFailureModal}
              style={customStyles}
            >
              <h1>Reservation Request Sent</h1>
              <p>This may be due to slow internet! Please retry the reservation</p>
              <a
                className="button-border fullwidth"
                onClick={(e) => {
                this.closeFailedModal();
              }}>Retry</a>
            </Modal>
          }

          {this.state.modalIsOpen &&
          <Modal
            isOpen={this.state.modalIsOpen}
            shouldCloseOnOverlayClick={false}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
          >
            <OrderForm
              closeModal={this.closeModal}
              loading={this.state.loading}
              handleSubmit={this.requestReservation}
            />
          </Modal>}

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
    addToCart,
    removeFromCart,
    emptyCart
  }
)(CheckoutPage);
