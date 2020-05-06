import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Router from "next/router";

import { isEmpty } from "lodash";
import moment from "moment";

import LocalStorageUtil from "../../utils/localStorageUtil";

// Actions:
import {
  updateSearch,
  updateSearchObject,
  updateSearchCollectionLocation,
  updateSearchDeliveryLocation,
  updateSearchBooking,
  updateSearchCollectionDate,
  updateSearchDeliveryDate,
} from "../../actions/searchActions";
import { updateLocalSearch } from "../../actions/localSearchActions";

// Components:
import Default from "../../layouts/default";
import Loader from "../../components/loader";
import SearchEdit from "../../components/searchComponents/searchedit/searchEdit";
import ProductTiles from "../../components/product-tiles/product-tiles";
import RecommendedProducts from "../../components/recommended-products/recommendedProducts";

// Utils:
import { CreateQueryParams } from "../../utils/queryparams";
import {
  getProducts,
  getRecomendedProductsByGroupIds,
} from "../../utils/rest/requests/products";
import { handleGeneralError } from "../../utils/rest/error/toastHandler";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // categories: [],
      products: [],
      recomendedProducts: [],
      total_page_count: 0,
      current_page: 0,
      loading: true,
      notFound: false,
      locations: [],
      searchUpdated: false,
    };
    this.meta = {
      title: "Search | OCEAN PREMIUM - Water toys Anytime Anywhere",
      description: "Index description",
    };
    this.counter = 0;
    this.mergeObj = this.mergeObj.bind(this);
  }

  static async getInitialProps({ query }) {
    const obj = query;
    if (query.keyword === undefined) {
      obj.keyword = "";
    }
    if (
      query.deliveryDate !== null &&
      !moment(query.deliveryDate, moment.ISO_8601).isValid()
    ) {
      obj.deliveryDate = null;
    }
    if (
      query.collectionDate !== null &&
      !moment(query.collectionDate, moment.ISO_8601).isValid()
    ) {
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
      booking: null,
    };
  }

  async componentDidMount() {
    const { keyword, deliveryLocation, collectionLocation } = this.props;
    if (keyword !== "") {
      this.meta = {
        title: `You searched for ${keyword} | OCEAN PREMIUM - Water toys Anytime Anywhere`,
        description: "Index description",
      };
    }

    if (deliveryLocation !== "" && collectionLocation !== "") {
      this.setState({ notFound: false });
      await this.getProducts("update");
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
    if (
      this.props.locationReducer.selectboxLocations.length > 0 &&
      !this.state.searchUpdated &&
      deliveryLocation !== "" &&
      collectionLocation !== ""
    ) {
      try {
        let search = {
          keyword,
          collectionDate,
          deliveryDate,
        };

        if (deliveryLocation !== "" && deliveryLocation !== null) {
          search.deliveryLocation = this.props.locationReducer.selectboxLocations.find(
            (item) => item.id === Number(deliveryLocation)
          );
        }

        if (collectionLocation !== "" && collectionLocation !== null) {
          search.collectionLocation = this.props.locationReducer.selectboxLocations.find(
            (item) => item.id === Number(collectionLocation)
          );
        }

        this.props.updateSearch(search);
        this.setState({
          searchUpdated: true,
        });
      } catch (error) {
        handleGeneralError(error);
      }
    }

    if (
      prevProps.keyword !== keyword ||
      prevProps.collectionDate !== collectionDate ||
      prevProps.deliveryDate !== deliveryDate ||
      prevProps.collectionLocation !== collectionLocation ||
      prevProps.deliveryLocation !== deliveryLocation
    ) {
      this.setState({ products: [], current_page: 0, total_page_count: 0 });
      // if query parameters have been modified by user
      if (
        (keyword === "" || category_id === "",
        deliveryLocation === "" || collectionLocation === "")
      ) {
        this.setState({ notFound: true, loading: false });
      } else {
        this.setState({ notFound: false });
        await this.getProducts("update");
      }
    }
  }

  async getProducts(type) {
    const {
      category_id,
      keyword,
      deliveryLocation,
      collectionLocation,
      collectionDate,
      deliveryDate,
    } = this.props;

    let { current_page, products } = this.state;
    try {
      if (type === "update") {
        current_page = 0;
      }
      this.setState({ loading: true, notFound: false });
      const response = await getProducts(
        keyword,
        category_id,
        deliveryLocation,
        collectionLocation,
        deliveryDate,
        collectionDate,
        current_page
      );

      const products = response.data;
      const recomendedProducts = await getRecomendedProductsByGroupIds(
        products.map((x) => x.productGroup.id)
      );
      this.setState({
        notFound: false,
        loading: false,
        products: products,
        recomendedProducts: recomendedProducts.data,
        total_page_count: Math.ceil(
          response.meta.totalRowCount / response.meta.perPage
        ),
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

  // async getCategories() {
  //   const response = await getCategories();
  //   this.setState({
  //     categories: response.data
  //   });
  // }

  async getMoreProducts() {
    await this.getProducts("append");
  }

  async mergeObj(obj) {
    if (obj.bookingOnly) {
      setTimeout(() => {
        const bookingSelected = {
          id: obj.bookingOnly.id,
          name: obj.bookingOnly.name,
          value: {
            id: obj.bookingOnly.id,
            name: obj.bookingOnly.name,
          },
        };
        this.props.updateSearchBooking(bookingSelected);
      }, 100);
    }

    if (obj.booking) {
      const cart = await LocalStorageUtil.getCart();
      const booking = cart.find((x) => x.id === obj.booking.id);
      const { locationReducer } = this.props;

      setTimeout(() => {
        const bookingSelected = {
          id: obj.booking.id,
          name: obj.booking.name,
          value: {
            id: obj.booking.id,
            name: obj.booking.name,
          },
        };
        this.props.updateSearchBooking(bookingSelected);
        this.props.updateSearchDeliveryLocation(
          locationReducer.selectboxLocations.find(
            (x) => x.id === booking.location.delivery.id
          )
        );
        this.props.updateSearchCollectionLocation(
          locationReducer.selectboxLocations.find(
            (x) => x.id === booking.location.collection.id
          )
        );
        this.props.updateSearchCollectionDate(booking.period.end);
        this.props.updateSearchDeliveryDate(booking.period.start);
      }, 300);
    }

    if (obj.deliveryLocation) {
      setTimeout(() => {
        this.props.updateSearchDeliveryLocation(obj.deliveryLocation);
      }, 100);
    }

    if (obj.collectionLocation) {
      setTimeout(() => {
        this.props.updateSearchCollectionLocation(obj.collectionLocation);
      }, 100);
    }

    if (obj.deliveryDate) {
      setTimeout(() => {
        this.props.updateSearchDeliveryDate(obj.deliveryDate);
      }, 100);
      console.info("handle delivery date change");
    }

    if (obj.collectionDate) {
      setTimeout(() => {
        this.props.updateSearchCollectionDate(obj.collectionDate);
      }, 100);
      console.info("handle delivery date change");
    }

    setTimeout(() => {
      const params = CreateQueryParams(this.props.searchReducer.search);
      Router.push({ pathname: "/search", query: params });
    }, 500);
  }

  render() {
    const {
      products,
      recomendedProducts,
      loading,
      notFound,
    } = this.state;

    return (
      <Default nav="fixed" search meta={this.meta}>
        <SearchEdit onChange={this.mergeObj} />
        <div className="container">
          <div className="row">
            <div className="col" style={{paddingLeft: 0, paddingRight: 0}}>
              <h1 className="search-title">
                You searched for{" "}
                {this.props.query && <span className="uppercase">{this.props.query}</span>}{" "}
                {!this.props.query && <span className="uppercase">All</span>}
              </h1>
              <h3>
                Compare our models and add the perfect one to your booking
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {notFound === true ? (
                <h1 className="search-title">
                  No results found for your search query
                </h1>
              ) : null}

              {isEmpty(products) ? null : (
                <Fragment>
                  <div className="row products">
                    <ProductTiles products={products} search={true} />
                  </div>
                  {recomendedProducts.length && (
                    <div style={{ position: "relative", top: "-65px" }}>
                      <RecommendedProducts products={recomendedProducts} />
                    </div>
                  )}

                  <div className="row">
                    <div className="col banner">
                      <div
                        style={{ width: "100%", top: "62px" }}
                        className="grid"
                      >
                        <div
                          style={{ textAlign: "center" }}
                          className="banner-left-title "
                        >
                          <h1 style={{ color: "white" }}>Support</h1>
                          <div className="banner-right-text">
                            Available 24/7
                          </div>
                        </div>

                        <div
                          style={{ display: "flex" }}
                          className="banner-right-text"
                        >
                          <div className="col-md-6">
                            <h2>EMAIL</h2>
                            info@oceanpremium.com
                          </div>
                          <div className="col-md-6">
                            <h2>PHONE</h2>
                            +33 781 15 12 54
                          </div>
                        </div>
                      </div>
                      <img src="/static/images/banner-image-3.png" />
                    </div>
                  </div>
                </Fragment>
              )}
              {loading ? (
                <div className="page-wrapper">
                  <Loader />
                </div>
              ) : null}
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
    locationReducer,
  };
};

export default connect(mapStateToProps, {
  updateSearch,
  updateSearchObject,
  updateLocalSearch,
  updateSearchDeliveryLocation,
  updateSearchCollectionLocation,
  updateSearchBooking,
  updateSearchCollectionDate,
  updateSearchDeliveryDate,
})(SearchPage);
