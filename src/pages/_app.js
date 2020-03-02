import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';
import { setLocations, setSelectLocations } from '../actions/locationActions';
import { emptyCart, addToCart } from '../actions/cartActions';
import { getLocations } from '../utils/rest/requests/locations';
import { handleGeneralError } from '../utils/rest/error/toastHandler';
import store from '../store';
import '../assets/scss/styles.scss';
import SelectboxLocation from '../utils/mapping/locations/SelectboxLocation';
import LocalStorageUtil from '../utils/localStorageUtil';
import 'bootstrap/dist/css/bootstrap-grid.min.css';

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

    const cart =  LocalStorageUtil.getCart()
    if (cart && cart !== "" && cart !== undefined && cart !== null) {
      let filteredItemsInCart = [];
      if (cart && cart.filter) {
        filteredItemsInCart = cart.filter((item) => {
          const now = moment().format('YYYY-MM-DDTHH:mm:ss.ssZ');
          if (item && item !== null && item !== undefined && !moment(item.period.start).isBefore(now, 'day')) {
            store.dispatch(addToCart(item));
            return item;
          }
        });
        LocalStorageUtil.setCart(filteredItemsInCart);
      }
    }
  }

  async retrieveLocations() {
    try {
      const response = await getLocations();
      if (response.data) {
        const locations = response.data;
        store.dispatch(setLocations(response.data));
        const selectboxLocations = response.data.map((selectboxLocation) => {
          const selectLocation = new SelectboxLocation(selectboxLocation);
          return selectLocation;
        });

        const emptyLocation = {
          id: null,
          label: "",
          name: "",
          value: {
            id: null,
            name: ""
          },
        }

        selectboxLocations.unshift(new SelectboxLocation(emptyLocation));
        store.dispatch(setSelectLocations(selectboxLocations));
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
