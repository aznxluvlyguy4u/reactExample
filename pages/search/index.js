import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import slugify from 'slugify';
import { updateSearch } from '../../actions/searchActions';
import Loader from '../../components/loader';
import Pagination from '../../components/pagination';
import SearchEdit from '../../components/searchedit/searchEdit';
import Default from '../../layouts/default';
import searchReducer from '../../reducers/searchReducer';
import ProductResponse from '../../utils/mapping/products/ProductResponse';
import { getProducts } from '../../utils/rest/requests/products';
import '../index/index.scss';
import './search.scss';

const getHTML = products => products.map(item => (
  <Link href={`/detail?id=${item.id}&slug=${slugify(item.name)}`} as={`/detail/${item.id}/${slugify(item.name)}`}>
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
      products: [], total_page_count: 0, current_page: 0, loading: true, notFound: false, query: {},
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
      keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate, dispatch, category_id,
    } = this.props;

    if (keyword !== '') {
      this.meta = { title: `You searched for ${keyword} | OCEAN PREMIUM - Water toys Anytime Anywhere`, description: 'Index description' };
    }
    dispatch(updateSearch({
      keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
    }));

    if (keyword === '' && category_id) {
      this.setState({ notFound: false });
      await this.getProducts('update');
    } else if (keyword === '') {
      this.setState({ notFound: true, loading: false });
    } else {
      this.setState({ notFound: false });
      await this.getProducts('update');
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate, dispatch, category_id,
    } = this.props;

    if (prevProps.keyword !== keyword || prevProps.collectionDate !== collectionDate || prevProps.deliveryDate !== deliveryDate || prevProps.collectionLocation !== collectionLocation || prevProps.deliveryLocation !== deliveryLocation) {
      this.setState({ products: [], current_page: 0, total_page_count: 0 });
      dispatch(updateSearch({
        keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
      }));
      if (keyword === '' || category_id === '') {
        this.setState({ notFound: true, loading: false });
      } else {
        this.setState({ notFound: false });
        await this.getProducts('update');
      }
    }
  }

  async getProducts(type) {
    const {
      category_id, keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
    } = this.props;
    const { current_page, products } = this.state;
    try {
      this.setState({ loading: true, notFound: false });
      const response = await getProducts(keyword, category_id, deliveryLocation, collectionLocation, deliveryDate, collectionDate, this.state.current_page);
      const responseProducts = response.data.map(i => new ProductResponse(i).returnProduct());
      this.setState({
        notFound: false,
        loading: false,
        products: type === 'append' ? [...products, ...responseProducts] : responseProducts,
        total_page_count: Math.ceil(response.meta.totalRowCount / response.meta.perPage),
        current_page: response.meta.page,
      });
    } catch (error) {
      this.setState({ loading: false });
      if (error.code === 404) {
        if (current_page <= 1) {
          this.setState({ notFound: true });
        }
      }
      console.log(error);
    }
  }

  async getMoreProducts() {
    await this.getProducts('append');
  }

  render() {
    console.log(this.props.searchReducer);
    const {
      products, loading, notFound, total_page_count, current_page,
    } = this.state;

    return (
      <Default nav="fixed" search meta={this.meta}>
        <SearchEdit />
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
              <Pagination total_page_count={total_page_count} current_page={current_page} onClick={() => this.getMoreProducts()}>
                {getHTML(products)}
              </Pagination>
              {loading ? <Loader /> : null}
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(searchReducer)(SearchPage);
