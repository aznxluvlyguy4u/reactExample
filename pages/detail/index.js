import React, { Component } from 'react';
import Default from '../../layouts/default';
import './detail.scss';
import { getProductById } from '../../utils/rest/requests/products';
import SearchEdit from '../../components/searchedit/searchEdit';

const meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = { product: undefined };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id),
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  async getProduct() {
    const { id } = this.props;
    try {
      const response = await getProductById(id);
      this.setState({ product: response.data });
    } catch (error) {
      console.log(error);
    }
  }

  submitSearch(values) {
    console.log(values);
  }

  render() {
    const { product } = this.state;
    if (product) {
      return (
        <Default nav="fixed" search meta={meta}>
          <div className="page-wrapper">
            <div className="fullWidthImage" style={{ backgroundImage: `url(${product.images[0].fullImageUrl})` }} />
            <h1>{product.name}</h1>
            <div className="detail-wrapper">
              <div className="description">
                <h2>Description</h2>
                <span>{product.description}</span>
              </div>
              <div className="form">
                <h3>Add to cart</h3>
                <SearchEdit label submit handleSubmit={this.submitSearch} validation />
              </div>
            </div>
          </div>
        </Default>
      );
    }
    return null;
  }
}

export default DetailPage;
