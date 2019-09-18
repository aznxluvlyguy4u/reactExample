import { cloneDeep, isEmpty } from 'lodash';
import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import moment from 'moment';
import OptionalAccessoryView from '../../components/detailSubViews/optionalAccessoryView';
import SummaryView from '../../components/detailSubViews/summaryView';
import SearchView from '../../components/detailSubViews/searchView';
import Steps from '../../components/detailSubViews/steps'
import Loader from '../../components/loader';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import {
  resetLocalSearch
} from '../../actions/localSearchActions';
import { generateSearchQueryParameterString } from '../../utils/queryparams';

import Order from '../../utils/mapping/products/order';
import OrderRequest from   '../../utils/mapping/products/orderRequest' ;//'../../utils/mapping/products/orderRequest';
import { getProductById } from '../../utils/rest/requests/products';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {
  updateLocalSearch,
  updateLocalSearchProductQuantity,
  setSelectedProduct,
  setProductAccessories,
  setProductMandatoryAccessories,
  setProductOptionalAccessories,
  setProductConfigurations,
  setTotalSteps,
  setCurrentStep
} from '../../actions/localSearchActions';
import {
  updateCart,
  addToCart,
  setCart
} from '../../actions/cartActions';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessories: [],
      product: undefined,
      configurations: [],
      total: undefined,
    };

    this.addToCart = this.addToCart.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.changeAccesoire = this.changeAccesoire.bind(this);
    this.onChangeConfiguration = this.onChangeConfiguration.bind(this);
    this.continueShopping = this.continueShopping.bind(this);
    // this.renderThirdView = this.renderThirdView.bind(this);
    // this.meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id),
    };
  }

  async componentDidMount() {
    this.props.resetLocalSearch();

    await this.getProduct();
  }

  continueShopping() {
    this.props.resetLocalSearch();
    // check if previous search exists...
    // If so continue to search.
    // Else continue to home page so user can start a fresh search')
    if(this.props.searchReducer.search.deliveryLocation) {
      const params = generateSearchQueryParameterString(this.props.searchReducer.search);
      Router.push({ pathname: '/search', query: params });
    } else {
      Router.push({ pathname: '/' });
    }
  }

  async getProduct() {
    const { id } = this.props;
    try {
      const response = await getProductById(id);
      this.setState({ product: response.data });
      this.props.setSelectedProduct(response.data);

      if (response.data.accessories) {

        this.props.setTotalSteps(4);

        const accessories = [];
        response.data.accessories.map(item => {
          item.quantity = 0;
          accessories.push(item)
        });

        // Only show accessories that are labeled as OPTIONAL as  optional accessories
        const optional = accessories.filter(val => val.type === 'OPTIONAL');
        const mandatory = accessories.filter(val => val.type === 'MANDATORY');

        this.props.setProductAccessories(accessories);
        this.props.setProductOptionalAccessories(optional);
        this.props.setProductMandatoryAccessories(mandatory);
      }

      if (isEmpty(response.data.accessories)) {
        this.props.setTotalSteps(3);
      }

      if (response.data.configurations) {
        const array = [];
        response.data.configurations.map(item => array.push({ id: item.id, name: item.name, value: item.values[0].name }));
        this.props.setProductConfigurations(array)
      }
    } catch (error) {
      handleGeneralError(error);
    }
  }

  _next() {
    // If the current step is 1 or 2, then add one on "next" button click
    const currentStep = this.props.localSearchReducer.currentStep >= this.props.localSearchReducer.totalSteps ? this.props.localSearchReducer.totalSteps : this.props.localSearchReducer.currentStep + 1;
    this.props.setCurrentStep(currentStep);
  }

  _prev() {
    // If the current step is 2 or 3, then subtract one on "previous" button click
    const currentStep = this.props.localSearchReducer.currentStep <= 1 ? 1 : this.props.localSearchReducer.currentStep - 1;
    this.props.setCurrentStep(currentStep);
  }

  addToCart() {
    const order = new Order().returnOrder();

    let existingItems = this.props.cartReducer.items;
    let mergedItems = [];
    if(existingItems.some((someItem) => {
      return (someItem.id === order.selectedProduct.id &&
      moment(someItem.period.start).isSame(moment(order.deliveryDate), 'day') &&
      moment(someItem.period.end).isSame(moment(order.collectionDate), 'day') &&
      someItem.location.collection.name === order.collectionLocation.label &&
      someItem.location.delivery.name === order.deliveryLocation.label)
    })) {
      mergedItems = existingItems.map(item => {
        if (
          item.id === order.selectedProduct.id &&
            moment(item.period.start).isSame(moment(order.deliveryDate), 'day') &&
            moment(item.period.end).isSame(moment(order.collectionDate), 'day') &&
            item.location.collection.name === order.collectionLocation.label &&
            item.location.delivery.name === order.deliveryLocation.label
          ) {
            item.quantity = item.quantity + order.productQuantity;
            if(item.accessories) {
              item.accessories.map(existingAccessory => {
                order.productOptionalAccessories.map(newAccessory => {
                  if (existingAccessory.id === newAccessory.id) {
                    existingAccessory.quantity = existingAccessory.quantity + newAccessory.quantity;
                  }
                });
              });
            }
          return item;
        } else {
          return item;
        }
      });
    }

    if (mergedItems.length === 0)  {
      existingItems = [...existingItems, order.orderRequest]
    } else {
      existingItems = mergedItems
    }

    this.props.setCart(existingItems);
    localStorage.setItem('cart', JSON.stringify(existingItems));
    this.props.setCurrentStep(5);
  }

  changeAccesoire(val) {
    const index = this.state.accessories.findIndex(item => item.id === JSON.parse(val.dropdown).id);
    this.state.accessories[index] = JSON.parse(val.dropdown);
    this.setState({ accessories: this.state.accessories });
  }

  onChangeConfiguration(val) {
    const index = this.state.configurations.findIndex(item => item.id === JSON.parse(val.configuration).id);
    this.state.configurations[index] = JSON.parse(val.configuration);
    this.setState({ configurations: this.state.configurations });
  }

  nextButton() {
    if (this.props.localSearchReducer.currentStep < this.props.localSearchReducer.totalSteps) {
      return (
        <button
          className="next-button"
          type="button"
          onClick={this._next}
        >
        Next
        </button>
      );
    }
    // ...else render nothing
    return null;
  }

  previousButton() {
    // If the current step is not 1, then render the "previous" button
    if (this.props.localSearchReducer.currentStep !== 1) {
      return (
        <button
          className="previous-button"
          type="button"
          onClick={this._prev}
        >
        Previous
        </button>
      );
    }
    // ...else return nothing
    return null;
  }

  render() {
    const {
      product, accessories,
    } = this.state;
    if (product) {
      return (
        <Default nav="fixed" search meta={{ title: `${product.name} | OCEAN PREMIUM`, description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
          <div className="page-wrapper">
            <div className="fullWidthImage" style={{ backgroundImage: `url(${product.images[0].fullImageUrl})` }} />
            <h1>{product.name}</h1>
            <div className="detail-wrapper">
              <div className="description">
                {product.description.section1 && product.description.section1.head ? <h2>{product.description.section1.head}</h2> : null}
                {product.description.section1 && product.description.section1.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section1.paragraph }} /> : null}
                {product.description.section2 && product.description.section2.head ? <h2>{product.description.section2.head}</h2> : null}
                {product.description.section2 && product.description.section2.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section2.paragraph }} /> : null}
                {product.description.section3 && product.description.section3.head ? <h2>{product.description.section3.head}</h2> : null}
                {product.description.section3 && product.description.section3.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section3.paragraph }} /> : null}
                {product.description.section4 && product.description.section4.head ? <h2>{product.description.section4.head}</h2> : null}
                {product.description.section4 && product.description.section4.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section4.paragraph }} /> : null}
                {product.description.section5 && product.description.section5.head ? <h2>{product.description.section5.head}</h2> : null}
                {product.description.section5 && product.description.section5.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section5.paragraph }} /> : null}
                {product.description.section6 && product.description.section6.head ? <h2>{product.description.section6.head}</h2> : null}
                {product.description.section6 && product.description.section6.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section6.paragraph }} /> : null}
                {product.description.section7 && product.description.section7.head ? <h2>{product.description.section7.head}</h2> : null}
                {product.description.section7 && product.description.section7.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section7.paragraph }} /> : null}
                {product.description.section8 && product.description.section8.head ? <h2>{product.description.section8.head}</h2> : null}
                {product.description.section8 && product.description.section8.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section8.paragraph }} /> : null}
                {product.description.section9 && product.description.section9.head ? <h2>{product.description.section9.head}</h2> : null}
                {product.description.section9 && product.description.section9.paragraph ? <div dangerouslySetInnerHTML={{ __html: product.description.section9.paragraph }} /> : null}
              </div>
              <div className="form-wrapper">

              {/* STEP SEARCH / ITINERARY */}
              {this.props.localSearchReducer.currentStep === 1 ?
                <SearchView
                  configurationsstate={this.state.configurations}
                  onChangeConfiguration={this.onChangeConfiguration}
                  _prev={this._prev}
                  _next={this._next}
                  data={product}
                />
                : null }

                {/* STEP SELECT QUANTITY */}
                {this.props.localSearchReducer.currentStep === 2 ?
                  <div className={'form active quantity-wrapper'}>
                    <div className="titlewrapper">
                      <h3 className="localSearchTitle">Product Quantity</h3>
                      <Steps />
                    </div>
                    <div className="item-wrap">
                      <div className="big-counter">
                        <button className="subtract-button"
                          onClick={(e) => {
                            if (this.props.localSearchReducer.productQuantity > 0) {
                              this.props.updateLocalSearchProductQuantity(this.props.localSearchReducer.productQuantity - 1)
                            }
                          }}
                        >
                          &minus;
                        </button>
                        <span className="center">
                          <span className="quantity">
                            {this.props.localSearchReducer.productQuantity}
                          </span>
                          <br />
                          {this.props.localSearchReducer.selectedProduct.rates &&
                            <Fragment>
                              € {parseFloat(this.props.localSearchReducer.selectedProduct.rates[0].price * this.props.localSearchReducer.productQuantity).toFixed(2)}
                            </Fragment>
                          }
                        </span>

                        <button className="add-button"
                          onClick={(e) => {
                            this.props.updateLocalSearchProductQuantity(this.props.localSearchReducer.productQuantity + 1)
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="button-wrapper">
                      {this.previousButton(this.state.currentStep)}
                      {this.nextButton(this.state.currentStep)}
                    </div>
                  </div>
                  : null
                }

                {/* STEP OPTIONAL ACCESSORIES */}
                {this.props.localSearchReducer.currentStep === 3 && this.props.localSearchReducer.totalSteps === 4 ?
                  <div className={'form active accessories-wrapper'}>
                    <div className="titlewrapper">
                      <h3 className="localSearchTitle">Optional Accessories</h3>
                      <Steps />
                    </div>
                    <div className="item-wrap">
                      <OptionalAccessoryView
                        onChange={this.changeAccesoire}
                      />
                    </div>
                    <div className="button-wrapper">
                      {this.previousButton()}
                      {this.nextButton()}
                    </div>
                  </div>
                  : null
                }

                {/* STEP SUMMARY */}
                {(this.props.localSearchReducer.currentStep === 3 && this.props.localSearchReducer.totalSteps === 3) || this.props.localSearchReducer.currentStep === 4 ?
                  <SummaryView
                    total={this.state.total}
                    _prev={this._prev}
                    accessories={this.state.accessories}
                    handleSubmit={this.addToCart}
                    accessories={accessories.filter(val => val.type !== 'mandatory')}
                  /> : null
                }

                {/* STEP CONTINUE SHOPPING? */}
                {this.props.localSearchReducer.currentStep === 5 ?
                  <div className="form active confirmationview">
                    <div className="titlewrapper">
                      {" "}
                    </div>
                    <div className="subview">
                      <img src="/static/images/success.png" height="100" width="100" />
                      <button
                        className="search-button-full"
                        type="button"
                        onClick={(e) => {
                          this.continueShopping()
                        }}
                      >
                        Continue Shopping
                      </button>
                      <span>or</span>
                      <Link
                        onClick={(e) => {
                          this.props.resetLocalSearch()
                        }}
                        href="/checkout"><a className="search-button-border">Go To Cart</a></Link>
                    </div>
                  </div>
                  :
                  null
                }
              </div>
            </div>
          </div>
        </Default>
      );
    }
    return (
      <Default nav="fixed" search meta={{ title: 'Detail Page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <Loader />
        </div>
      </Default>
    );
  }
}

const mapStateToProps = ({ rootReducer, searchReducer, locationReducer, localSearchReducer, cartReducer }) => {
  return {
    searchReducer,
    locationReducer,
    localSearchReducer,
    rootReducer,
    cartReducer
  };
};

export default connect(
  mapStateToProps, {
    updateLocalSearch,
    updateLocalSearchProductQuantity,
    updateCart,
    addToCart,
    setSelectedProduct,
    setProductAccessories,
    setProductMandatoryAccessories,
    setProductOptionalAccessories,
    setProductConfigurations,
    setTotalSteps,
    setCurrentStep,
    resetLocalSearch,
    setCart
  }
)(DetailPage);
