import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import slugify from 'slugify';
import { updateSearch, updateSearchObject } from '../../actions/searchActions';
import Loader from '../../components/loader';
import Pagination from '../../components/pagination';
import SearchEdit from '../../components/searchComponents/searchedit/searchEdit';
import Default from '../../layouts/default';
import searchReducer from '../../reducers/searchReducer';
import ProductResponse from '../../utils/mapping/products/ProductResponse';
import { CreateQueryParams } from '../../utils/queryparams';
import { getProducts } from '../../utils/rest/requests/products';
import '../index/index.scss';
import './search.scss';
import { getLocations } from '../../utils/rest/requests/locations';

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
      products: [], total_page_count: 0, current_page: 0, loading: true, notFound: false, locations: [],
    };
    this.meta = { title: 'Search | OCEAN PREMIUM - Water toys Anytime Anywhere', description: 'Index description' };
    this.counter = 0;
    this.mergeObj = this.mergeObj.bind(this);
  }

  static async getInitialProps({ query }) {
    const obj = query;
    if (query.keyword === undefined) {
      obj.keyword = '';
    }
    if (query.deliveryDate !== null && !moment(query.deliveryDate, moment.ISO_8601).isValid()) {
      obj.deliveryDate = null;
    }
    if (query.collectionDate !== null && !moment(query.collectionDate, moment.ISO_8601).isValid()) {
      obj.collectionDate = null;
    }
    if (query.category !== null && !Number.isInteger(query.category)) {
      obj.category_id = null;
    }
    if (query.deliveryLocation !== null && isNaN(query.deliveryLocation)) {
      obj.deliveryLocation = null;
    }
    if (query.collectionLocation !== null && isNaN(query.collectionLocation)) {
      obj.collectionLocation = null;
    }
    return {
      keyword: decodeURIComponent(obj.keyword),
      category_id: obj.category,
      deliveryLocation: obj.deliveryLocation,
      collectionLocation: obj.collectionLocation,
      deliveryDate: obj.deliveryDate,
      collectionDate: obj.collectionDate,
    };
  }

  async componentDidMount() {
    const {
      keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate, dispatch, category_id,
    } = this.props;

    if (keyword !== '') {
      this.meta = { title: `You searched for ${keyword} | OCEAN PREMIUM - Water toys Anytime Anywhere`, description: 'Index description' };
    }

    try {
      const response = await getLocations();
      this.setState({locations: response.data})

      const deliveryLocationNew = response.data.find((item) => item.id === Number(deliveryLocation));
      const collectionLocationNew = response.data.find((item) => item.id === Number(collectionLocation));
      
      dispatch(updateSearch({
        keyword, deliveryLocation: deliveryLocationNew, collectionLocation: collectionLocationNew, collectionDate, deliveryDate,
      }));
    } catch (error){
      console.log(error);
    }

      // dispatch(updateSearch({
      //   keyword, deliveryLocation, collectionLocation, collectionDate, deliveryDate,
      // }));

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
      
      if (!isEmpty(this.state.locations)){
        const deliveryLocationNew = this.state.locations.find((item) => item.id === Number(deliveryLocation));
        const collectionLocationNew = this.state.locations.find((item) => item.id === Number(collectionLocation));
      
        dispatch(updateSearch({
          keyword, deliveryLocation: deliveryLocationNew, collectionLocation: collectionLocationNew, collectionDate, deliveryDate,
        }));
      } else {
        const response = await getLocations();
        this.setState({locations: response.data});

        const deliveryLocationNew = response.data.find((item) => item.id === Number(deliveryLocation));
        const collectionLocationNew = response.data.find((item) => item.id === Number(collectionLocation));
      
        dispatch(updateSearch({
          keyword, deliveryLocation: deliveryLocationNew, collectionLocation: collectionLocationNew, collectionDate, deliveryDate,
        }));
      }
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
    let { current_page, products } = this.state;
    try {
      if (type === 'update') {
        current_page = 0;
      }
      this.setState({ loading: true, notFound: false });
      const response = await getProducts(keyword, category_id, deliveryLocation, collectionLocation, deliveryDate, collectionDate, current_page);
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
        this.setState({ notFound: true });
      }
      console.log(error);
    }
  }

  async getMoreProducts() {
    await this.getProducts('append');
  }

  mergeObj(obj) {
    const { dispatch } = this.props;
    // if (obj.collectionLocation !== '' && obj.collectionLocation !== undefined && obj.collectionLocation !== null) {
    //   obj.collectionLocation = JSON.parse(obj.collectionLocation).id;
    // }
    // if (obj.deliveryLocation !== '' && obj.deliveryLocation !== undefined && obj.deliveryLocation !== null) {
    //   obj.deliveryLocation = JSON.parse(obj.deliveryLocation).id;
    // }
    console.log(obj);
    dispatch(updateSearchObject(this.props.searchReducer.search, obj));
    const query = CreateQueryParams(this.props.searchReducer.search);
    Router.push({ pathname: '/search', query });
  }

  render() {
    const {
      products, loading, notFound, total_page_count, current_page,
    } = this.state;
    return (
      <Default nav="fixed" search meta={this.meta}>
        <SearchEdit onChange={this.mergeObj} />
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
