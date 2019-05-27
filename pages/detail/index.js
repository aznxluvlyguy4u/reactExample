import moment from 'moment';
import React, { Component } from 'react';
import OptionalAccessoiryModal from '../../components/detail-modals/optionalAccessoiryModal';
import SearchModal from '../../components/detail-modals/searchModal';
import SummaryModal from '../../components/detail-modals/summaryModal';
import Default from '../../layouts/default';
import { getProductById } from '../../utils/rest/requests/products';
import './detail.scss';
import Loader from '../../components/loader';

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
    };
    this.submitSearch = this.submitSearch.bind(this);
    this.submitAccesory = this.submitAccesory.bind(this);
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
        response.data.accessories.map(item => arr.push(false));
        arr.push(false);
        this.setState({ active: [...active, ...arr] });
      }
    } catch (error) {
      console.log(error);
    }
  }

  submitSearch(values) {
    const { active, product } = this.state;
    const collectionDate = moment(values.collectionDate);
    const deliveryDate = moment(values.deliveryDate);
    const daysInterval = deliveryDate.diff(collectionDate, 'days');
    const index = 1;
    if (index < active.length) {
      const arr = active.fill(false);
      arr[index] = true;
      this.setState({ active: arr });
    }
    this.setState(prevState => ({
      item: {
        ...prevState.item,
        startDate: collectionDate,
        endDate: deliveryDate,
        startLocation: values.collectionLocation,
        endLocation: values.deliveryLocation,
        totalPrice: daysInterval * product.rates[0].price,
        daysInterval,
        pricePerDay: product.rates[0].price,
      },
    }));
  }

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
              <SearchModal data={product} total={active.length} active={active[0]} handleSubmit={this.submitSearch} index={1} />
              {product.accessories ? product.accessories.map((item, index) => <OptionalAccessoiryModal daysInterval={this.state.item.daysInterval} total={active.length} index={index + 2} handleSubmit={this.submitAccesory} data={item} active={active[index + 1]} />) : null}
              <SummaryModal item={this.state.item} accessories={accessories.filter(val => val.type !== 'mandatory')} active={active[active.length - 1]} index={active.length} total={active.length} />
            </div>
          </div>
        </Default>
      );
    }
    return (
<Default nav="fixed" search meta={{ title: `Detail Page | OCEAN PREMIUM`, description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
    <div className="page-wrapper">
    <Loader />
    </div>
    </Default>
);
  }
}

export default DetailPage;
