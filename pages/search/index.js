import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import React, { Component } from 'react';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';
import { updateSearch } from '../../actions/searchActions';
import Loader from '../../components/loader';
import Default from '../../layouts/default';
import searchReducer from '../../reducers/searchReducer';
import ProductResponse from '../../utils/mapping/products/ProductResponse';
import { getProducts } from '../../utils/rest/requests/products';
import '../index/index.scss';
import './search.scss';

const getHTML = products => products.map(item => (
  <Link href="/products">
    <a>
      <div className="result-item">
        <img alt={item.name} src={item.images.public_icon_url ? item.images.public_icon_url : '/static/images/flyboard.png'} />
        <h2>{item.name}</h2>
        <span>
          {`${item.rates.day_rate} / day`}
        </span>
      </div>
    </a>
  </Link>
));

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], total_page_count: 0, current_page: 0, loading: true, notFound: false, query: {}, open: false,
    };
    this.meta = { title: 'Search | OCEAN PREMIUM - Water toys Anytime Anywhere', description: 'Index description' };
    this.counter = 0;
  }

  static async getInitialProps({ query }) {
    if (query.keyword === undefined) {
      query.keyword = '';
    }
    if (query.deliveryDate !== null && !moment(query.deliveryDate, moment.ISO_8601).isValid()) {
      query.deliveryDate = null;
    }
    if (query.collectionDate !== null && !moment(query.collectionDate, moment.ISO_8601).isValid()) {
      query.collectionDate = null;
    }
    if (query.category !== null && !Number.isInteger(query.category)) {
      query.category_id = null;
    }
    if (query.deliveryLocation !== null && isNaN(query.deliveryLocation)) {
      query.deliveryLocation = null;
    }
    if (query.collectionLocation !== null && isNaN(query.collectionLocation)) {
      query.collectionLocation = null;
    }
    return {
      keyword: decodeURIComponent(query.keyword), category_id: query.category, deliveryLocation: query.deliveryLocation, collectionLocation: query.collectionLocation, deliveryDate: query.deliveryDate, collectionDate: query.collectionDate,
    };
  }

  async componentDidMount() {
    const {
      category_id, keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate, dispatch,
    } = this.props;

    if (keyword !== '') {
      this.meta = { title: `You searched for ${keyword} | OCEAN PREMIUM - Water toys Anytime Anywhere`, description: 'Index description' };
    }
    dispatch(updateSearch({
      keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
    }));
    await this.getProducts('update');
  }

  async componentDidUpdate(prevProps) {
    const {
      category_id, keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate, dispatch,
    } = this.props;

    if (prevProps.keyword !== keyword) {
      this.setState({ products: [], current_page: 0 });
      dispatch(updateSearch({
        keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
      }));
      await this.getProducts('update');
    }
  }

  async getProducts(type) {
    const {
      category_id, keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
    } = this.props;
    try {
      this.setState({ loading: true, notFound: false });
      const response = await getProducts(keyword, category_id, deliveryLocation, collectionLocation, deliveryDate, collectionDate, this.state.current_page);
      const products = response.data.map(i => new ProductResponse(i).returnProduct());
      const myArray = products.filter(obj => obj.available === true);
      this.setState({
        notFound: false,
        loading: false,
        products: type === 'append' ? [...myArray, ...this.state.products] : myArray,
        total_page_count: Math.ceil(response.meta.totalRowCount / response.meta.perPage),
        current_page: response.meta.page,
      });
    } catch (error) {
      this.setState({ loading: false });
      if (error.code === 404) {
        if (this.state.current_page === 0) {
          this.setState({ notFound: true });
        }
      }
      console.log(error);
    }
  }

  async toggleClass() {
    await this.getProducts('append');
  }

  render() {
    const {
      products, loading, notFound, query, current_page, total_page_count,
    } = this.state;
    console.log(`page: ${this.state.current_page}`);
    console.log(`total page count: ${this.state.total_page_count}`);

    return (
      <Default nav="fixed" search meta={this.meta}>
        <div className="page-wrapper">
          <h1>Search Results</h1>
          <div className="search-block">
            <div className="result-wrapper">
              {notFound === true ? <h2>No results found for your search query</h2> : null}
              {isEmpty(products) ? (
                null
              ) : (
                <div className="searchresult-title">
                  <h3>Matching Water Toys</h3>
                  <span>Search through hundreds of Water Toys and add them to your trip!</span>
                </div>
              )}
              <Collapse isOpened className="result-wrapper">
                {getHTML(products)}
              </Collapse>
              {loading ? <Loader /> : null}
              {total_page_count > current_page ? <button className="showmore" onClick={() => this.toggleClass()}>Show More (+4) ></button> : null}
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(searchReducer)(SearchPage);
