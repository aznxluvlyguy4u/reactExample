import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';
import { setLocations } from '../actions/locationActions';
import { emptyCart, addToCart } from '../actions/cartActions';
import { getLocations } from '../utils/rest/requests/locations';
import { handleGeneralError } from '../utils/rest/error/toastHandler';
import store from '../store';
import '../assets/scss/styles.scss';

/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/

// const makeStore = (initialState, options) => createStore(rootReducer, initialState, composeWithDevTools());

class MyApp extends App {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.retrieveLocations();

    // Empty cart in store
    store.dispatch(emptyCart({}));

    let itemsInCart = JSON.parse(localStorage.getItem('cart'));
    let filteredItemsInCart = [];
    if (itemsInCart) {
      filteredItemsInCart = itemsInCart.filter(item => {
        if (!moment(item.deliveryDate).isBefore(Date().toString(), 'day')) {
          store.dispatch(addToCart(item));
          return item;
        }
      })
    }
    localStorage.setItem('cart', JSON.stringify(filteredItemsInCart));
  }

  async retrieveLocations() {
    try {
      const response = await getLocations();
      if (response.data) {
        // this.props.store.dispatch(setLocations(response.data));
        store.dispatch(setLocations(response.data));
      }
    } catch (error) {
      handleGeneralError(error);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

// export default withRedux(makeStore)(MyApp);
export default MyApp;
