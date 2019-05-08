import { isEmpty } from 'lodash';
import Link from 'next/link';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSearch } from '../../actions/searchActions';
import Loader from '../../components/loader';
import Default from '../../layouts/default';
import searchReducer from '../../reducers/searchReducer';
import { getProducts } from '../../utils/rest/requests/products';
import '../index/index.scss';
import './search.scss';
import ProductsRequest from '../../utils/mapping/products/ProductResponse';
import ProductResponse from '../../utils/mapping/products/ProductResponse';

const meta = { title: 'Oceanpremium - Search', description: 'Index description' };

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], total_page_count: 0, current_page: 0, loading: false, notFound: false,
    };
  }

  static async getInitialProps({ query }) {
    return {
      keyword: query.keyword, category_id: query.category, deliveryLocation: query.deliveryLocation, collectionLocation: query.collectionLocation, deliveryDate: query.deliveryDate, collectionDate: query.collectionDate,
    };
  }

  componentWillMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
  }

  async componentDidMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
    await this.getProducts(keyword);
  }

  async componentDidUpdate() {
    const { keyword, dispatch } = this.props;

    if (this.props.keyword !== await this.props.searchReducer.search.keyword) {
      this.setState({ products: [] });
      dispatch(updateSearch({ keyword }));
      await this.getProducts(keyword);
    }
  }

  async getProducts() {
    const {
      category_id, keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
    } = this.props;
    try {
      this.setState({ loading: true, notFound: false });
      const response = await getProducts(keyword, category_id, deliveryLocation, collectionLocation, deliveryDate, collectionDate);
      this.setState({
        notFound: false, loading: false, products: response.data.products.map(i => new ProductResponse(i).returnProduct()), total_page_count: response.data.meta.total_row_count / response.data.meta.per_page, current_page: response.data.page,
      });
    } catch (error) {
      this.setState({ loading: false });

      if (error.statusCode === 404) {
        this.setState({ notFound: true });
      }

      console.log(error);
    }
  }

  render() {
    const { products, loading, notFound } = this.state;
    console.log(products);
    return (
      <Default nav="fixed" search meta={meta}>
        <div className="page-wrapper">
          <h1>Search Results</h1>
          <div className="search-block">
            <div className="result-wrapper">
              {notFound === true ? <h2>No results found for your search query</h2> : null}
              {loading ? <Loader /> : null}
              {isEmpty(products) ? (
                null
              ) : (
                <div className="searchresult-title">
                  <h3>Matching Water Toys</h3>
                  <span>Search through hundreds of Water Toys and add them to your trip!</span>
                </div>
              )}
              {products.map(item => (
                <Link href="/products">
                  <a>
                    <div className="result-item">
                      <img src={item.images.public_icon_url ? item.images.public_icon_url : '/static/images/flyboard.png'} />
                      <h2>{item.name}</h2>
                      <span>
                        {`${item.rates.day_rate} / day`}
                      </span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </Default>
    );
  }
}

export default connect(searchReducer)(SearchPage);
