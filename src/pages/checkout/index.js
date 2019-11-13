import moment from 'moment';
import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import classnames from 'classnames';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import ContactInformationForm from '../../components/checkout/orderForm/contactInformationForm';
import ContracterInformationForm from '../../components/checkout/orderForm/contracterInformationForm';
import Counter from '../../components/detailSubViews/counter';
import Loader from '../../components/loader';
import Default from '../../layouts/default';
import { checkCartAvailability } from '../../utils/rest/requests/cart';
import PlaceOrderRequest from '../../utils/mapping/products/placeOrderRequest';
import UpdatedPlaceOrderRequest from '../../utils/mapping/products/UpdatedPlaceOrderRequest';
import { orderCartItems, updateOrderCartItems } from '../../utils/rest/requests/orders';
import { handlePaymentError } from '../../utils/rest/error/toastHandler';
import LocalStorageUtil from '../../utils/localStorageUtil';
import {Elements, StripeProvider} from 'react-stripe-elements';
import StripeForm from '../../components/checkout/StripeForm';
import PaymentMethodForm from '../../components/checkout/paymentMethodForm';

import { emptyCart, setCart } from '../../actions/cartActions';
import Script from 'react-load-script';

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
      orderSuccess: false,
      isMobile: false,
      orderFormStep: 1,
      cartUuid: null,
      contactInformation: null,
      contracterInformation: null,
      paymentIntent: null,
      paymentMethod: null
    };

    this.updateProductQuantity = this.updateProductQuantity.bind(this);
    this.updateAccessoryQuantity = this.updateAccessoryQuantity.bind(this);
    this.returnWarningMessage = this.returnWarningMessage.bind(this);
  }

  onStripeLoad() {
    if (window.Stripe) {
      this.setState({
        stripe: window.Stripe('pk_test_AOFhYRn5ibpkET6D6wghnmpj00AmrMn2js')
      });
    }
  }

  formatDate(date) {
    return moment(date).format('MM.DD.YYYY');
  }

  dayCount(item) {
    const collectionDate = moment(item.period.end).endOf('day');;
    const deliveryDate = moment(item.period.start).startOf('day');
    return collectionDate.diff(deliveryDate, 'days');
  }

  openAccessories = (item) => {
    item.collapsed = false;
    this.forceUpdate();
  }

  collapse(item) {
    if(item.collapsed) {
      item.collapsed = !item.collapsed;
    } else {
      item.collapsed = true;
    }
    this.forceUpdate();
  }

  openMobileExtra = (item) => {
    item.mobileCollapsed = true;
    this.forceUpdate();
  }

  collapseMobile = (item) => {
    if(item.mobileCollapsed) {
      item.mobileCollapsed = !item.mobileCollapsed;
    } else {
      item.mobileCollapsed = true;
    }
    this.setState({
      state: this.state
    })
    this.forceUpdate();
  }

  async getOrderRequsts() {
    return Promise.all(this.props.cartReducer.items.map(item => { item = item.orderRequest; return item}));
  }

  async componentDidUpdate(prevProps) {

  }

  resize() {
    this.setState({isMobile: window.innerWidth <= 760});
  }

  async componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    const items = LocalStorageUtil.getCart();
    if(items && items.length > 0) {
      this.setState({ loading: true });

      const orderRequest = items;
      if (orderRequest.length > 0) {
        let response = await checkCartAvailability(orderRequest)
          .then(response => {
            LocalStorageUtil.setCart(response.data.products);
            this.props.setCart(response.data.products);
            this.setState({
              products: response.data.products,
              loading: false
            })
          });
      }
    }
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
    if (item.quantityAvailable === 0) {
      return <img className="availabilityImage" src="/static/images/unavailable.png" />
    }

    if (item.quantityAvailable !== 0 && item.quantity > item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/unavailable.png" />
    }

    if (item.quantityAvailable !== 0 && item.quantity <= item.quantityAvailable) {
      return <img className="availabilityImage" src="/static/images/available.png" />
    }
  }

  calculateTotalAccessoires(accessories) {
    let price = 0;

    accessories.map(item => {
      if (item.rates && item.rates.length > 0) {
        price += this.dayCount(item) * Number(item.rates[0].price) * item.quantity
      }
    });
    return price;
  }

  calculateTotalPrice() {
    let productPrice = 0;
    let accessoryPrice = 0;

    this.state.products.map(product => {
      if (product.rates && product.rates.length > 0) {
        productPrice += (this.dayCount(product) * Number(product.rates[0].price) * product.quantity)
      }
      accessoryPrice += this.calculateTotalAccessoires(product.accessories)
      product.totalCostAccessories  = accessoryPrice;
      product.totalCostProducts = productPrice;
    });

    return parseFloat((productPrice + accessoryPrice).toFixed(2));
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      orderFormStep: 1
     });
  }

  updateProductQuantity(result) {
    if (result.quantity > 0) {
      result.item.quantity = result.quantity;
      this.setState({ state: this.state });
      LocalStorageUtil.setCart(this.state.products);
      this.props.setCart(this.state.products);
    }
    this.setState()
  }

  updateAccessoryQuantity(result) {
    if (result.quantity > 0) {
      result.item.quantity = result.quantity;
      this.setState({ state: this.state });
      LocalStorageUtil.setCart(this.state.products);
      this.props.setCart(this.state.products);
    }
  }

  removeProductFromCart(product) {
    const index = this.state.products.findIndex(item => {
      if (
        item.id === product.id &&
        moment(item.period.start).isSame(moment(product.period.start), 'day') &&
        moment(item.period.end).isSame(moment(product.period.end), 'day') &&
        item.location.collection.label === product.location.collection.label &&
        item.location.delivery.label === product.location.delivery.label
        ) {
          return item
        }
    });

    const products = [
      ...this.state.products.slice(0, index),
      ...this.state.products.slice(index + 1)
    ]

    this.setState({
      products: products
    });

    LocalStorageUtil.setCart(products);
    this.props.setCart(products);
  }

  removeAccessoryFromCart(product, accessory) {
    const products = this.state.products.map(item => {
      if (
        item.id === product.id &&
        moment(item.period.start).isSame(moment(product.period.start), 'day') &&
        moment(item.period.end).isSame(moment(product.period.end), 'day') &&
        item.location.collection.label === product.location.collection.label &&
        item.location.delivery.label === product.location.delivery.label
      ) {
        const index = item.accessories.findIndex(acc => {
          if (
            acc.id === accessory.id
          ) {
            return acc
          }
        });
        const newAccessories = [
          ...item.accessories.slice(0, index),
          ...item.accessories.slice(index + 1)
        ]
        item.accesories = [];
        item.accessories = newAccessories;
        return item;
      } else {
        return item
      }
    });

    this.setState({
      products: products
    })
    LocalStorageUtil.setCart(products);
    this.props.setCart(products);
  }

  handleContactInformationForm = (values) => {
    this.setState({
      orderFormStep: 2,
      contactInformation: values
    })
    return;
  }

  setOrder = (order) => {
    const orderJson = JSON.stringify(order);
    sessionStorage.setItem('order', orderJson);
  }
  getOrder = () => {
    const orderJson = sessionStorage.getItem('order');
    let order = null;
    if (orderJson !== "") {
      order = JSON.parse(orderJson);
    }
    return order;
  }

  setPaymentIntent = (paymentIntent) => {
    const paymentIntentJson = JSON.stringify(paymentIntent);
    sessionStorage.setItem('paymentIntent', paymentIntentJson);
  }

  getPaymentIntent = () => {
    const paymentIntentJson = sessionStorage.getItem('paymentIntent');
    let paymentIntent = null;
    if (paymentIntentJson !== "") {
      paymentIntent = JSON.parse(paymentIntentJson);
    }
    return paymentIntent;
  }

  handleContracterInformationForm = (values) => {
    this.setState({
      contracterInformation: values,
      orderFormStep: 3
    })
  }

  handlePaymentMethod = (values) => {
    this.setState({
      paymentMethod: values.paymentMethod.value
      // loading: true,
    });

    if (this.state.paymentMethod === 'CARD') {
      if (this.getOrder() !== null && this.getPaymentIntent() !== null) {
        // UPDATE existing order / payment intent
        const request = new UpdatedPlaceOrderRequest(this.getOrder(), this.state.products, this.state.contactInformation, this.state.contracterInformation, this.state.paymentMethod).returnUpdatedOrder();
        this.setState({ loading: true });
        const response = updateOrderCartItems(request)
          .then((res) => {
            if(res.code === 200) {
              this.setState({
                orderFormStep: 4,
                loading: false,
                originalOrder: res.data
              })
              this.setOrder(res.data);
              this.setPaymentIntent(res.data.paymentIntent);
            }

          })
          .catch(err => {
            this.setState({
              loading: false,
              orderFormStep: 3
            })
          });
      } else {
        // New order/ payment intent
        const request = new PlaceOrderRequest(this.state.products, this.state.contactInformation, this.state.contracterInformation, this.state.paymentMethod).returnOrder();
        this.setState({ loading: true });
        const response = orderCartItems(request)
          .then((res) => {
            if(res.code === 201) {
              this.setState({
                orderFormStep: 4,
                loading: false,
                originalOrder: res.data
              })
              this.setOrder(res.data);
              this.setPaymentIntent(res.data.paymentIntent);
            }
          })
          .catch(err => {
            this.setState({
              loading: false,
              orderFormStep: 3
            })
          });
      }
    } else if (this.state.paymentMethod === 'BANK_TRANSFER') {

    // alert('Show loader, call api send order, and receive betalings kenmerk');
    const request = new PlaceOrderRequest(this.state.products, this.state.contactInformation, this.state.contracterInformation, this.state.paymentMethod).returnOrder();
      this.setState({ loading: true });
      const response = orderCartItems(request)
        .then((res) => {
          if(res.code === 201) {
            this.setState({
              orderFormStep: 4,
              loading: false,
              originalOrder: res.data
            })
            this.setOrder(res.data);
          }
        })
        .catch(err => {
          this.setState({
            loading: false,
            orderFormStep: 3
          })
        });
      }
  }

  handleReady = (element) => {
    this.element = element;
  }

  handleStripePayment = (e) => {
    this.setState({
      loading: true,
    })


    // const splitSecret = getPaymentIntent().clientSecret.split('_secret_')[0];
    if (this.state.stripe && this.getPaymentIntent() !== null) {


      this.state.stripe
        .handleCardPayment(this.getPaymentIntent().clientSecret, this.element, {
          payment_method_data: {
            billing_details: {
              name: 'Jenny Rosen'
            }
          }
        })
        .then((payload) => {
          if (payload.error) {
            this.setState({
              loading: false,
              orderFormStep: 3,
            })
            handlePaymentError(payload.error);
          } else {
            this.setState({
              loading: false,
              orderSuccess: true,
              orderFormStep: 1,
              paymentIntent: null
            })
            // Clear and reset all;
            this.props.emptyCart();
            LocalStorageUtil.emptyCart();
          }
        })
    } else {
      this.setState({
        loading: false,
      })
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

  itemPrice = (item) => {
    if(item.rates && item.rates.length > 0) {
      return (
        <Fragment>
          €{parseFloat(Number(item.rates[0].price) * item.quantity * this.dayCount(item)).toFixed(2)}
        </Fragment>
      )
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
        <div className="page-wrapper">
          <div className="checkout-wrapper">
            <h1>Final Checkout</h1>
            {!this.state.loading && this.props.cartReducer.items.length > 0 ?
              <Fragment>
                <div className="cart-item heading">
                  <div className="row">
                    <div className="column heading">
                      &nbsp;
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
                      Pick up
                    </div>
                    <div className="column heading">
                      Return
                    </div>
                    <div className="column heading">
                      Availability
                    </div>
                    <div className="column heading">
                      &nbsp;
                    </div>
                    <div className="column heading">
                      &nbsp;
                    </div>
                  </div>
                </div>

                {this.state.products.map((item, index) => (
                    <div key={index} className={classnames({
                      'cart-item': true,
                      'isMobile': this.state.isMobile === true
                    })}>
                    <div className="product">
                      <div className="row">
                        <div className="column">
                          <button
                            onClick={(e) => {this.removeProductFromCart(item)}}>
                            <i className="icon-x"></i>
                          </button>
                        </div>
                        <div className="column">
                          {this.state.isMobile ?
                            <Fragment>
                              <a onClick={(e) => {this.collapseMobile(item)}}>
                                <small>{item.name}</small>
                                {item.images && item.images.length > 0 ?
                                <img className="checkoutProductImage" src={item.images[0].thumbnailUrl} />
                                : null}
                              </a>
                            </Fragment>
                          :
                            <Fragment>
                            <small>{item.name}</small>
                              {item.images && item.images.length > 0 ?
                                <img className="checkoutProductImage" src={item.images[0].thumbnailUrl} />
                              : null}
                            </Fragment>
                          }
                        </div>
                        <div className="column">
                          <Counter item={item} updateQuantity={this.updateProductQuantity} quantity={item.quantity} isClicked={(e) => {
                              if (this.state.isMobile) {
                                this.openMobileExtra(item)
                              }
                              this.openAccessories(item)
                            }} />
                        </div>
                        <div className="column">
                          {/* {item.rates && item.rates.length > 0 &&
                            <Fragment>
                              €{parseFloat(Number(item.rates[0].price) * item.quantity * this.dayCount(item)).toFixed(2)}
                            </Fragment>
                          } */}
                          {this.itemPrice(item)}
                        </div>
                        <div className="column">
                          <span>{this.formatDate(item.period.start)}</span>
                          <br />
                          <span>{item.location.delivery.name}</span>
                        </div>
                        <div className="column">
                          <span>{this.formatDate(item.period.end)}</span>
                          <br />
                          <span>{item.location.collection.name}</span>
                        </div>

                        <div className="column center">
                          {this.returnAvailabilityIcon(item)}
                        </div>
                        {/* warning */}
                        <div className="column">
                          <small>
                            {this.returnWarningMessage(item)}
                            <span dangerouslySetInnerHTML={{ __html: this.quantityText(item) }} />
                            {this.resetQuantityButton(item)}
                            <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(item) }} />
                          </small>
                          &nbsp;
                        </div>
                        {/* drop dopdown */}
                        <div className="column">
                          {item.accessories.length > 0 ?
                            <button className="yellow-chevron" onClick={(e) => {
                              this.collapse(item)
                            }}>
                              <i className={classnames({
                                'icon-down-open': item.collapsed && item.collapsed === true,
                                'icon-up-open': item.collapsed === null || item.collapsed === undefined || item.collapsed === false
                              })}></i>
                            </button>
                            :
                            <Fragment>&nbsp;</Fragment>
                          }
                        </div>
                      </div>
                    </div>

                    <div className={classnames({
                      'mobileExtra': true,
                      'mobileExtraOpen': item.mobileCollapsed !== null && item.mobileCollapsed !== undefined && item.mobileCollapsed === true
                    })}>
                      <div className="row generalInformation">
                        <div className="column pickupDroppoff" style={{marginLeft: '40px'}}>

                          <strong>Pick up</strong>
                          <br />
                          <span>{this.formatDate(item.period.start)}</span>
                          <br />
                          <span>{item.location.delivery.name}</span>
                          <br />
                          <br />
                          <strong>Return</strong>
                          <br />
                          <span>{this.formatDate(item.period.end)}</span>
                          <br />
                          <span>{item.location.collection.name}</span>
                        </div>
                        <div className="column availabilityMessage">
                          <small>
                            {this.returnWarningMessage(item)}
                            <span dangerouslySetInnerHTML={{ __html: this.quantityText(item) }} />
                            {this.resetQuantityButton(item)}
                            <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(item) }} />
                          </small>
                        </div>
                      </div>

                        {item.accessories.map((accessory, index) => (
                        <div className="row" key={index} style={
                          accessory.quantityAvailable === 0 ? {background: '#eee', color: '#bbb'} : null
                        }>
                          <div className="column">
                            <div className="column">
                              <button onClick={(e) => {this.removeAccessoryFromCart(item, accessory)}}>
                                <i className="icon-x"></i>
                              </button>
                            </div>
                          </div>
                          <div className="column">
                            {/* <small><strong>Optional Accessory</strong></small>
                            <br /> */}
                            <small>{accessory.name}</small>
                            {accessory.images && accessory.images.length > 0 ?
                              <img className="checkoutProductImage" src={accessory.images[0].thumbnailUrl} />
                            : null}
                          </div>
                          <div className="column">
                            <Counter item={accessory} updateQuantity={this.updateAccessoryQuantity} quantity={accessory.quantity}/>
                          </div>
                          <div className="column">
                             {this.itemPrice(accessory)}
                          </div>
                          <div className="column">
                            &nbsp;
                          </div>
                          <div className="column">
                            &nbsp;
                          </div>

                          <div className="column center">
                            {this.returnAvailabilityIcon(accessory)}
                          </div>
                          <div className="column">
                            <small>Optional Accessory</small>
                            <br />
                            <small>
                              {this.returnWarningMessage(accessory)}
                              <span dangerouslySetInnerHTML={{ __html: this.quantityText(accessory) }} />
                              {this.resetQuantityButton(accessory)}
                              <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(accessory) }} />
                            </small>
                            &nbsp;
                          </div>
                        </div>)
                      )}
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
                              <button onClick={(e) => {this.removeAccessoryFromCart(item, accessory)}}>
                                <i className="icon-x"></i>
                              </button>
                            </div>
                          </div>
                          <div className="column">
                            <small>{accessory.name}</small>
                            {accessory.images && accessory.images.length > 0 ?
                              <img className="checkoutProductImage" src={accessory.images[0].thumbnailUrl} />
                            : null}
                          </div>
                          <div className="column">
                            <Counter item={accessory} updateQuantity={this.updateAccessoryQuantity} quantity={accessory.quantity}/>
                          </div>
                          <div className="column">
                            {this.itemPrice(accessory)}
                          </div>
                          <div className="column">
                            &nbsp;
                          </div>
                          <div className="column">
                            &nbsp;
                          </div>

                          <div className="column center">
                            {this.returnAvailabilityIcon(accessory)}
                          </div>
                          <div className="column">
                            <small>Optional Accessory</small>
                            <br />
                            <small>
                              {this.returnWarningMessage(accessory)}
                              <span dangerouslySetInnerHTML={{ __html: this.quantityText(accessory) }} />
                              {this.resetQuantityButton(accessory)}
                              <span dangerouslySetInnerHTML={{ __html: this.checkStoreText(accessory) }} />
                            </small>
                            &nbsp;
                          </div>
                          <div className="column heading">
                            &nbsp;
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
                      <h3>Transport cost</h3>
                    </div>
                    <div className="column">
                      <h3>€ 0</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <h3>Total Rental Fee (excl. VAT)</h3>
                    </div>
                    <div className="column">
                      <h3>€ {this.calculateTotalPrice()}</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <p style={{fontSize: '12px', textAlign: 'left'}}>
                      <strong>Please note:</strong>
                      <br />
                      A security deposit will be charged before picking up your rented toys</p>
                    </div>
                    <div className="column">

                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      &nbsp;
                    </div>
                    <div className="column">
                      {this.state.products.length > 0 &&
                      <a
                        className="button-full right"
                        onClick={(e) => {
                          this.openModal()
                        }}
                      >
                        Order now
                      </a>}
                    </div>
                  </div>
                </div>
                </Fragment> :
              <Fragment>
                {!this.state.loading && <span style={{textAlign: 'center'}}>Your cart is empty</span>}
              </Fragment>
            }
          </div>
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
              <h1>Order Sent</h1>
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
              <h1>Your payment failed Request Failed</h1>
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
          <div className="order-form">

            {this.state.orderFormStep === 1 &&
            <ContactInformationForm
              initialValues={this.state.contactInformation}
              cancel={() => {
                this.closeModal()
              }}
              loading={this.state.loading}
              handleSubmit={this.handleContactInformationForm}
            />}

            {this.state.orderFormStep === 2 &&
              <ContracterInformationForm
                initialValues={this.state.contracterInformation}
                cancel={() => {
                  this.setState({
                    orderFormStep: 1
                  })
                }}
                loading={this.state.loading}
                handleSubmit={this.handleContracterInformationForm}
              />
            }

            {this.state.orderFormStep === 3 &&
              <PaymentMethodForm
                handleSubmit={this.handlePaymentMethod}
              cancel={() => this.setState({
                orderFormStep: 2
              })}
              />
            }

            {this.state.orderFormStep === 4 && this.state.paymentMethod === 'BANK_TRANSFER' &&
              <Fragment>
                <p>
                  Thank you for your order. Please transfer the fee to the following bank account with payment id <strong>{this.state.originalOrder.orderId}</strong>
                </p>
                <button
                  className="button-border fullwidth"
                  onClick={
                    this.closeModal
                  }>
                    Close
                </button>
              </Fragment>

            }

            {this.state.orderFormStep === 4 && this.state.paymentMethod === 'CARD' &&
              <StripeProvider stripe={this.state.stripe}>
                <Elements>
                  <Fragment>
                    <StripeForm
                      onReady={this.handleReady}
                      paymentIntent={this.getPaymentIntent()}
                      cancel={() => {
                        this.setState({
                          orderFormStep: 3
                        })
                      }}
                      handleSubmit={() => {
                        this.handleStripePayment()
                      }}
                    />
                  </Fragment>
                </Elements>
              </StripeProvider>
            }

          </div>

          </Modal>}

          <Script
            url='https://js.stripe.com/v3/'
            onLoad={() => this.onStripeLoad()} />
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
    emptyCart,
    setCart
  }
)(CheckoutPage);
