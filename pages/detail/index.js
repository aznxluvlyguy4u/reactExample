import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import OptionalAccessoryView from '../../components/detailSubViews/optionalAccessoryView';
import SummaryView from '../../components/detailSubViews/summaryView';
import SearchView from '../../components/detailSubViews/searchView';
import Steps from '../../components/detailSubViews/steps'
import Loader from '../../components/loader';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import OrderRequest from '../../utils/mapping/products/orderRequest';
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
  addToCart
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
    // this.renderThirdView = this.renderThirdView.bind(this);
    // this.meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id),
    };
  }

  async componentDidMount() {
    await this.getProduct();
    const search = Object.assign({}, this.props.searchReducer.search);
    this.props.updateLocalSearch(search);
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

        const optional = accessories.filter(val => val.type !== 'mandatory');
        const mandatory = accessories.filter(val => val.type === 'mandatory');

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
    const newobj = new OrderRequest(this.state.product, this.state.accessories, this.state.search, this.state.configurations).returnOrder();
    if (localStorage.getItem('cart')) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      cart.push(newobj);
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const arr = [];
      arr.push(newobj);
      localStorage.setItem('cart', JSON.stringify(arr));
    }
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
                      <h3>Optional Accessories</h3>
                      <Steps />
                    </div>
                    <div className="item-wrap">
                      <div>
                        <button className="subtract-button"
                          onClick={(e) => {
                            if (this.props.localSearchReducer.productQuantity > 0) {
                              this.props.updateLocalSearchProductQuantity(this.props.localSearchReducer.productQuantity - 1)
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="center">
                          <span className="quantity">
                            {this.props.localSearchReducer.productQuantity}
                          </span>
                          <br />
                          €{this.props.localSearchReducer.selectedProduct.rates[0].price}
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
                      <h3>Optional Accessories</h3>
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

const mapStateToProps = ({ rootReducer, searchReducer, locationReducer, localSearchReducer }) => {
  return {
    searchReducer,
    locationReducer,
    localSearchReducer,
    rootReducer
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
    setCurrentStep
  }
)(DetailPage);
