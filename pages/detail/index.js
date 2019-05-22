import React, { Component } from 'react';
import Default from '../../layouts/default';
import './detail.scss';
import { getProductById } from '../../utils/rest/requests/products';
import SearchEdit from '../../components/searchedit/searchEdit';
import SearchModal from '../../components/detail-modals/searchModal';
import OptionalAccessoiryModal from '../../components/detail-modals/optionalAccessoiryModal';
import {merge} from 'lodash';
import moment from 'moment';

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = { product: undefined, active: [true], daysInterval: undefined };
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
    const { product } = this.state;
    await this.getProduct();
  }

  async getProduct() {
    const { id } = this.props;
    try {
      const response = await getProductById(id);
      this.setState({ product: response.data });
      const arr = []
      if(response.data.accessories){
        response.data.accessories.map(item => arr.push(false))
        this.setState({active: [...this.state.active,...arr,]})
      }
    } catch (error) {
      console.log(error);
    }
  }

  submitSearch(values) {
    const collectionDate = moment(values.collectionDate)
    const deliveryDate = moment(values.deliveryDate);
    this.setState({active: [false, true], daysInterval: deliveryDate.diff(collectionDate, 'days')})
  }

  submitAccesory(values){
    const value = JSON.parse(values.dropdown.value)
    const index = value.index
    if (index < this.state.active.length){
      const arr = this.state.active.fill(false)
      arr[index] = true
      this.setState({active: arr})
    }
  }

  render() {
    const { product } = this.state;
    console.log(this.state.active)
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
              <SearchModal total={this.state.active.length} active={this.state.active[0]} handleSubmit={this.submitSearch} index={1}/>
              {product.accessories ? product.accessories.map((item, index) => {
                return <OptionalAccessoiryModal daysInterval={this.state.daysInterval} total={this.state.active.length} index={index+2} handleSubmit={this.submitAccesory} data={item} active={this.state.active[index+1]} />
              }) : null}
            </div>
          </div>
        </Default>
      );
    }
    return null;
  }
}

export default DetailPage;
