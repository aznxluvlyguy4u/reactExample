import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import slugify from 'slugify';
import { updateSearch, updateSearchObject } from '../../actions/searchActions';
import { updateLocalSearch } from '../../actions/localSearchActions';
import Loader from '../../components/loader';
import Pagination from '../../components/pagination';
import SearchEdit from '../../components/searchComponents/searchedit/searchEdit';
import Default from '../../layouts/default';
import ProductResponse from '../../utils/mapping/products/ProductResponse';
import { CreateQueryParams } from '../../utils/queryparams';
import { getProducts } from '../../utils/rest/requests/products';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      total_page_count: 0,
      current_page: 0,
      loading: true,
      notFound: false,
      locations: [],
      searchUpdated: false
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

  getHtml = (products) => {

  }

  async componentDidMount() {
    const {
      keyword,
      deliveryLocation,
      collectionLocation,
    } = this.props;

    if (keyword !== '') {
      this.meta = { title: `You searched for ${keyword} | OCEAN PREMIUM - Water toys Anytime Anywhere`, description: 'Index description' };
    }

    // if query parameters have been modified by user
    // (keyword === '' && category_id) || (keyword === '' && deliveryLocation) &&
    if (deliveryLocation !== '' && collectionLocation !== '') {
      this.setState({ notFound: false });
      await this.getProducts('update');
    } else {
      this.setState({ notFound: true, loading: false });
    }
  }

  async componentDidUpdate(prevProps) {

    const {
      keyword,
      deliveryLocation,
      collectionLocation,
      collectionDate,
      deliveryDate,
      category_id,
    } = this.props;

    // if locations are in memory retrieve the locations by
    // id and put the search query in store
    if(this.props.locationReducer.selectboxLocations.length > 0 && !this.state.searchUpdated && deliveryLocation !== '' && collectionLocation !== '') {
      try {

        let search = {
          keyword,
          collectionDate,
          deliveryDate
        }

        if (deliveryLocation !== '' && deliveryLocation !== null) {
          search.deliveryLocation = this.props.locationReducer.selectboxLocations.find(item => item.id === Number(deliveryLocation));
        }

        if (collectionLocation !== '' && collectionLocation !== null) {
          search.collectionLocation = this.props.locationReducer.selectboxLocations.find(item => item.id === Number(collectionLocation));
        }

        this.props.updateSearch(search);
        this.setState({
          searchUpdated: true
        })
      } catch (error) {
        handleGeneralError(error);
      }
    }

    if (prevProps.keyword !== keyword || prevProps.collectionDate !== collectionDate || prevProps.deliveryDate !== deliveryDate || prevProps.collectionLocation !== collectionLocation || prevProps.deliveryLocation !== deliveryLocation) {
      this.setState({ products: [], current_page: 0, total_page_count: 0 });
      // if query parameters have been modified by user
      if (keyword === '' || category_id === '', deliveryLocation === '' || collectionLocation === '') {
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
        return;
      } else {
        handleGeneralError(error);
      }
    }
  }

  async getMoreProducts() {
    await this.getProducts('append');
  }

  mergeObj(obj) {
    this.props.updateSearchObject(this.props.searchReducer.search, obj);
    const params = CreateQueryParams(this.props.searchReducer.search);
    Router.push({ pathname: '/search', query: params });
  }

  render() {
    const {
      products,
      loading,
      notFound,
      total_page_count,
      current_page,
    } = this.state;

    return (
      <Default nav="fixed" search meta={this.meta}>
        <SearchEdit onChange={this.mergeObj} />
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="main-title">Search Results</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">

              {notFound === true ? <h2>No results found for your search query</h2> : null}

              {isEmpty(products) ?
                null
              :
                <Fragment>
                  <div className="row">
                    <div className="col">
                      <div className="searchresult-title">
                        <h2 className="section-title">Matching Water Toys</h2>
                        <span>Search through hundreds of Water Toys and add them to your trip!</span>
                      </div>
                    </div>
                  </div>
                  <div className="row products">
                    {products.map((item, index) => {
                      return (
                        <div className="col-lg-3 col-md-4 col-sm-6">
                          {item.available ?
                            <Link
                              key={index}
                              href={`/detail?id=${item.id}&slug=${slugify(item.name)}`}
                              as={`/detail/${item.id}/${slugify(item.name)}`}
                            >
                              <a>
                                <div className="product">
                                  <img alt={item.name} src={item.images.public_icon_url ? item.images.public_icon_url : '/static/images/flyboard.png'} />
                                  <h4>{item.name}</h4>
                                  <span>
                                    {`from € ${item.rates.day_rate}`}
                                  </span>
                                </div>
                              </a>
                            </Link> :
                            <div className="product">
                              <img alt={item.name} src={item.images.public_icon_url ? item.images.public_icon_url : '/static/images/flyboard.png'} />
                              <h4>{item.name}</h4>
                              <span>
                                {/* {`from € ${item.rates.day_rate}`} */}
                                Currently not available
                              </span>
                              <div className="unavailable"></div>

                            </div>
                          }
                        </div>
                      )
                    })}
                  </div>
                  <div className="row">
                    <div className="col">
                      {/* {total_page_count > current_page ? <button className="showmore" onClick={onClick}>Show More (+4) ></button> : null} */}
                    </div>
                  </div>
                </Fragment>
              }
              {loading ? <Loader /> : null}
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

const mapStateToProps = ({ searchReducer, locationReducer }) => {
  return {
    searchReducer,
    locationReducer
  };
};

export default connect(
  mapStateToProps,{
    updateSearch,
    updateSearchObject,
    updateLocalSearch
  })(SearchPage);
