import moment from 'moment';
import React, { Component } from 'react';
import OptionalAccessoiryModal from '../../components/detail-modals/optionalAccessoiryModal';
import SearchModal from '../../components/detail-modals/searchModal';
import SummaryModal from '../../components/detail-modals/summaryModal';
import Default from '../../layouts/default';
import { getProductById } from '../../utils/rest/requests/products';
import './detail.scss';
import Loader from '../../components/loader';
import OrderRequest from '../../utils/mapping/products/orderRequest';
import { connect } from 'react-redux';
import { isEmpty, cloneDeep } from 'lodash';
import cartReducer from '../../reducers/cartReducer';
import { updateCart } from '../../actions/cartActions';
import searchReducer from '../../reducers/searchReducer';
import { updateSearchObject } from '../../actions/searchActions';
import rootReducer from '../../reducers/rootReducer';
import { getLocations } from '../../utils/rest/requests/locations';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessories: [],
      product: undefined,
      currentStep: 1,
      configurations: [],
      search: {
        collectionLocation: { id: undefined, name: undefined },
        deliveryLocation: { id: undefined, name: undefined },
        collectionDate: undefined,
        deliveryDate: undefined,
        dayCount: 0,
      },
      locations: [],
    };
    this.addToCart = this.addToCart.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.changeAccesoire = this.changeAccesoire.bind(this);
    this.onChangeConfiguration = this.onChangeConfiguration.bind(this);
    this.renderSecondView = this.renderSecondView.bind(this);
    // this.meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id),
    };
  }

  async componentDidMount() {
    // localStorage.removeItem('cart');
    await this.getProduct();
    const clonedSearch = cloneDeep(this.props.searchReducer.search);
    if (this.props.searchReducer.collectionDate && this.props.searchReducer.deliveryDate) {
      const collectionDate = moment(clonedSearch.collectionDate);
      const deliveryDate = moment(clonedSearch.deliveryDate);
      console.log(deliveryDate.toString(), collectionDate.toString())
      const dayCount = deliveryDate.diff(collectionDate, 'days');
      clonedSearch.dayCount = dayCount;
    }
    try {
      const response = await getLocations();
      this.setState({ locations: response.data });
    } catch (error) {
      console.log(error);
    }
    this.props.dispatch(updateSearchObject(clonedSearch, clonedSearch));
    this.setState({ search: clonedSearch });
  }

  async getProduct() {
    const { id } = this.props;
    const { active } = this.state;
    try {
      const response = await getProductById(id);
      this.setState({ product: response.data });
      const arr = [];
      if (response.data.accessories) {
        response.data.accessories.map(item => arr.push({ id: item.id, quantity: 0, name: item.name }));
        this.setState({ accessories: arr });
      }
      if (response.data.configurations) {
        const array = [];
        response.data.configurations.map(item => array.push({ id: item.id, name: item.name, value: item.values[0].name }));
        this.setState({ configurations: array });
      }
    } catch (error) {
      console.log(error);
    }
  }

  _next() {
    let { currentStep } = this.state;
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    this.setState({
      currentStep,
    });
  }

  _prev() {
    let { currentStep } = this.state;
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep,
    });
  }

  addToCart() {
    const newobj = new OrderRequest(this.state.product, this.state.accessories, this.state.search, this.state.configurations, this.state.locations).returnOrder();
    this.props.dispatch(updateCart(this.props.cartReducer.count));
    console.log(newobj);
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

  changeItem(val) {
    const clonedSearch = cloneDeep(this.state.search);
    if (Object.keys(val)[0] === 'collectionLocation') {
      clonedSearch.collectionLocation = JSON.parse(val[Object.keys(val)[0]]);
    }
    if (Object.keys(val)[0] === 'deliveryLocation') {
      clonedSearch.deliveryLocation = JSON.parse(val[Object.keys(val)[0]]);
    }
    if (Object.keys(val)[0] === 'collectionDate') {
      const collectionDate = moment(val[Object.keys(val)[0]]);
      const deliveryDate = moment(clonedSearch.deliveryDate);
      console.log(deliveryDate.toString(), collectionDate.toString())
      clonedSearch.dayCount = collectionDate.diff(deliveryDate, 'days');
      clonedSearch.collectionDate = val[Object.keys(val)[0]];
    }
    if (Object.keys(val)[0] === 'deliveryDate') {
      const deliveryDate = moment(val[Object.keys(val)[0]]);
      const collectionDate = moment(clonedSearch.collectionDate);
      console.log(deliveryDate.toString(), collectionDate.toString())
      clonedSearch.dayCount = collectionDate.diff(deliveryDate, 'days');
      clonedSearch.deliveryDate = val[Object.keys(val)[0]];
    }
    this.props.dispatch(updateSearchObject(clonedSearch, clonedSearch));
    this.setState({
      search: clonedSearch,
    });
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

  nextButton(currentStep) {
    if (currentStep < 3) {
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

  previousButton(currentStep) {
    // If the current step is not 1, then render the "previous" button
    if (currentStep !== 1) {
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

  returnAccessoires(product) {
    return (
      <div>
        <div className="item-wrap">
          {product.accessories ? product.accessories.map(item => <OptionalAccessoiryModal onChange={this.changeAccesoire} currentStep={this.state.currentStep} data={item} />) : null}
        </div>
        <div className="button-wrapper">
          {this.previousButton(this.state.currentStep)}
          {this.nextButton(this.state.currentStep)}
        </div>
      </div>
    );
  }

  renderSecondView(product) {
    const {
      accessories, currentStep, item,
    } = this.state;
    if (isEmpty(product.accessories)) {
      return currentStep === 2 ? <SummaryModal currentStep={this.state.currentStep} _prev={this._prev} accessories={this.state.accessories} search={this.state.search} product={product} handleSubmit={this.addToCart} accessories={accessories.filter(val => val.type !== 'mandatory')} /> : null;
    }
    return currentStep === 2 ? this.returnAccessoires(product) : null;
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
                <h2>Description</h2>
                <span>{product.description[0].custom_product_description_head_1}</span>
              </div>
              <div className="form-wrapper">
                <h3>{`Currentstep: ${this.state.currentStep}`}</h3>
                <SearchModal onChangeConfiguration={this.onChangeConfiguration} _prev={this._prev} _next={this._next} currentStep={this.state.currentStep} handleChange={this.changeItem} data={product} />
                {this.renderSecondView(product)}
                {!isEmpty(product.accessories) && this.state.currentStep === 3 ? <SummaryModal currentStep={this.state.currentStep} _prev={this._prev} accessories={this.state.accessories} search={this.state.search} product={product} handleSubmit={this.addToCart} accessories={accessories.filter(val => val.type !== 'mandatory')} /> : null}
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

export default connect(rootReducer)(DetailPage);
