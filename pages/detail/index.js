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

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessories: [],
      product: undefined,
      active: [true],
      item: {
        startDate: undefined,
        endDate: undefined,
        startLocation: undefined,
        endLocation: undefined,
        totalPrice: undefined,
        daysInterval: undefined,
        pricePerDay: undefined,
      },
      currentStep: 1,
    };
    // this.submitSearch = this.submitSearch.bind(this);
    this.submitAccesory = this.submitAccesory.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.changeAccesoire = this.changeAccesoire.bind(this);
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
      console.log(arr);
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

  // submitSearch(values) {
  //   const { active, product } = this.state;
  //   const collectionDate = moment(values.collectionDate);
  //   const deliveryDate = moment(values.deliveryDate);
  //   const daysInterval = deliveryDate.diff(collectionDate, 'days');
  //   const index = 1;
  //   if (index < active.length) {
  //     const arr = active.fill(false);
  //     arr[index] = true;
  //     this.setState({ active: arr });
  //   }
  //   this.setState(prevState => ({
  //     item: {
  //       ...prevState.item,
  //       startDate: collectionDate,
  //       endDate: deliveryDate,
  //       startLocation: values.collectionLocation,
  //       endLocation: values.deliveryLocation,
  //       totalPrice: daysInterval * product.rates[0].price,
  //       daysInterval,
  //       pricePerDay: product.rates[0].price,
  //     },
  //   }));
  // }

  submitAccesory(values) {
    const { active, accessories } = this.state;
    const value = JSON.parse(values.dropdown.value);
    const { index } = value;
    if (index < active.length) {
      const arr = active.fill(false);
      arr[index] = true;
      this.setState({ active: arr });
    }
    if (value.quantity > 0) {
      const obj = {
        quanitity: value.quantity,
        data: value.data,
      };
      this.setState({
        accessories: [...accessories, obj],
      });
    }
  }

  addToCart() {
    new OrderRequest(this.state.product, this.state.item, this.state.accessories).returnOrder();
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  changeItem(val) {
    console.log(val);
    this.setState({
      [Object.keys(val)[0]]: val[Object.keys(val)[0]],
    });
  }

  changeAccesoire(val) {
    const index = this.state.accessories.findIndex(item => item.id === JSON.parse(val.dropdown).id);
    this.state.accessories[index] = JSON.parse(val.dropdown);
    this.setState({ accessories: this.state.accessories });

    // this.setState({
    //   [Object.keys(val)[0]]: val[Object.keys(val)[0]],
    // });
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
        {product.accessories ? product.accessories.map(item => <OptionalAccessoiryModal onChange={this.changeAccesoire} currentStep={this.state.currentStep} daysInterval={this.state.item.daysInterval} data={item} />) : null}
        {this.previousButton(this.state.currentStep)}
        {this.nextButton(this.state.currentStep)}
      </div>
    );
  }

  render() {
    console.log(this.state);
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
                <SearchModal _prev={this._prev} _next={this._next} currentStep={this.state.currentStep} handleChange={this.changeItem} data={product} />
                {this.state.currentStep && this.state.currentStep === 2 ? this.returnAccessoires(product) : null}
              </div>

              {/* <SummaryModal handleSubmit={this.addToCart} item={this.state.item} accessories={accessories.filter(val => val.type !== 'mandatory')} active={active[active.length - 1]} index={active.length} total={active.length} /> */}
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
