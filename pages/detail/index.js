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
import { isEmpty } from 'lodash';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessories: [],
      product: undefined,
      currentStep: 1,
      configurations: [],
      search: {
        collectionLocation: undefined,
        deliveryLocation: undefined,
        collectionDate: undefined,
        deliveryDate: undefined,
      },
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
    await this.getProduct();
  }

  async getProduct() {
    const { id } = this.props;
    const { active } = this.state;
    try {
      const response = await getProductById(id);
      this.setState({ product: response.data });
      const arr = [];
      if (response.data.accessories) {
        response.data.accessories.map(item => arr.push({ id: item.id, quantity: 0 }));
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
    const newobj = new OrderRequest(this.state.product, this.state.accessories, this.state.search, this.state.configurations).returnOrder();
    console.log(newobj);
  }

  changeItem(val) {
    this.state.search[Object.keys(val)[0]] = val[Object.keys(val)[0]];
    this.setState({
      search: this.state.search,
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
          className="btn btn-primary float-right"
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
          className="btn btn-secondary"
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
        {product.accessories ? product.accessories.map(item => <OptionalAccessoiryModal onChange={this.changeAccesoire} currentStep={this.state.currentStep} data={item} />) : null}
        {this.previousButton(this.state.currentStep)}
        {this.nextButton(this.state.currentStep)}
      </div>
    );
  }

  renderSecondView(product) {
    const {
      accessories,
    } = this.state;
    console.log(product);
    if (isEmpty(product.accessories)) {
      console.log('no accessoires');
      return this.state.currentStep === 2 ? <SummaryModal handleSubmit={this.addToCart} item={this.state.item} accessories={accessories.filter(val => val.type !== 'mandatory')} /> : null;
    }
    console.log('accessoires');
    return this.state.currentStep === 2 ? this.returnAccessoires(product) : null;
  }


  render() {
    const {
      product, active, accessories,
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
                <span>{product.description}</span>
              </div>
              <div>
                <h3>{`Currentstep: ${this.state.currentStep}`}</h3>
                <SearchModal onChangeConfiguration={this.onChangeConfiguration} _prev={this._prev} _next={this._next} currentStep={this.state.currentStep} handleChange={this.changeItem} data={product} />
                {this.renderSecondView(product)}
                {!isEmpty(product.accessories) && this.state.currentStep === 3 ? <SummaryModal handleSubmit={this.addToCart} item={this.state.item} accessories={accessories.filter(val => val.type !== 'mandatory')} /> : null}
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

export default DetailPage;
