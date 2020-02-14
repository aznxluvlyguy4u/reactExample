import { cloneDeep, isEmpty } from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import React, { Component, Fragment } from "react";
import slugify from "slugify";
import Link from "next/link";
import { connect } from "react-redux";
import moment from "moment";
import ScrollableAnchor, { configureAnchors } from "react-scrollable-anchor";

import OptionalAccessoryView from "../../components/detailSubViews/optionalAccessoryView";
import SummaryView from "../../components/detailSubViews/summaryView";
import SearchView from "../../components/detailSubViews/searchView";
import Steps from "../../components/detailSubViews/steps";
import Loader from "../../components/loader";
import Default from "../../layouts/default";
import { resetLocalSearch } from "../../actions/localSearchActions";
import { generateSearchQueryParameterString } from "../../utils/queryparams";

import Order from "../../utils/mapping/products/order";
import { getProductById } from "../../utils/rest/requests/products";
import { handleGeneralError } from "../../utils/rest/error/toastHandler";
import {
  updateLocalSearch,
  updateLocalSearchProductQuantity,
  setSelectedProduct,
  setProductAccessories,
  setProductMandatoryAccessories,
  setProductOptionalAccessories,
  setProductConfigurations,
  setTotalSteps,
  setCurrentStep
} from "../../actions/localSearchActions";
import { updateCart, addToCart, setCart } from "../../actions/cartActions";

import ProductBookingForm from "../../components/product-booking-components/product-booking-form";
import ProductBookingSummary from "../../components/product-booking-components/product-booking-summary";

class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessories: [],
      product: undefined,
      configurations: [],
      total: undefined,
      selectedProductUrl: null
    };

    this.addToCart = this.addToCart.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.changeAccesoire = this.changeAccesoire.bind(this);
    this.onChangeConfiguration = this.onChangeConfiguration.bind(this);
    this.continueShopping = this.continueShopping.bind(this);

    this.props.resetLocalSearch();
    const search = Object.assign({}, this.props.searchReducer.search);
    this.props.updateLocalSearch(search);
    // this.renderThirdView = this.renderThirdView.bind(this);
    // this.meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id)
    };
  }

  componentWillMount() {
    configureAnchors();
  }

  async componentDidMount() {
    await this.getProduct();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      await this.getProduct();
    }
  }

  continueShopping() {
    this.props.resetLocalSearch();
    // check if previous search exists...
    // If so continue to search.
    // Else continue to home page so user can start a fresh search')
    if (this.props.searchReducer.search.deliveryLocation) {
      const params = generateSearchQueryParameterString(
        this.props.searchReducer.search
      );
      Router.push({ pathname: "/search", query: params });
    } else {
      Router.push({ pathname: "/" });
    }
  }

  async getProduct(deliveryLocation) {
    const { id } = this.props;
    let deliveryLocationId = null;

    if (
      this.props.searchReducer.search.deliveryLocation &&
      this.props.searchReducer.search.deliveryLocation.id
    ) {
      deliveryLocationId = this.props.searchReducer.search.deliveryLocation.id;
    }
    if (
      this.props.localSearchReducer.search.deliveryLocation &&
      this.props.localSearchReducer.search.deliveryLocation.id
    ) {
      deliveryLocationId = this.props.localSearchReducer.search.deliveryLocation
        .id;
    }

    if (deliveryLocation) {
      deliveryLocationId = deliveryLocation.id;
    }
    try {
      let response = await getProductById(id, deliveryLocationId);

      response.data.qty = 0;

      let initialUrl = null;
      if (response.data.images && response.data.images.length > 0) {
        initialUrl = response.data.images[0].url;
      }

      this.setState({ product: response.data, selectedProductUrl: initialUrl });
      this.props.setSelectedProduct(response.data);

      if (response.data.accessories) {
        this.props.setTotalSteps(4);

        const accessories = [];
        response.data.accessories.map(item => {
          item.quantity = 0;
          accessories.push(item);
        });

        // Only show accessories that are labeled as OPTIONAL as  optional accessories
        const optional = accessories.filter(val => val.type === "OPTIONAL");
        const mandatory = accessories.filter(val => val.type === "MANDATORY");

        this.props.setProductAccessories(accessories);
        this.props.setProductOptionalAccessories(optional);
        this.props.setProductMandatoryAccessories(mandatory);
      }

      if (isEmpty(response.data.accessories)) {
        this.props.setTotalSteps(3);
      }

      if (response.data.configurations) {
        const array = [];
        response.data.configurations.map(item =>
          array.push({
            id: item.id,
            name: item.name,
            value: item.values[0].name
          })
        );
        this.props.setProductConfigurations(array);
      }
    } catch (error) {
      handleGeneralError(error);
    }
  }

  _next() {
    // If the current step is 1 or 2, then add one on "next" button click
    const currentStep =
      this.props.localSearchReducer.currentStep >=
      this.props.localSearchReducer.totalSteps
        ? this.props.localSearchReducer.totalSteps
        : this.props.localSearchReducer.currentStep + 1;
    this.props.setCurrentStep(currentStep);
  }

  _prev() {
    // If the current step is 2 or 3, then subtract one on "previous" button click
    const currentStep =
      this.props.localSearchReducer.currentStep <= 1
        ? 1
        : this.props.localSearchReducer.currentStep - 1;
    this.props.setCurrentStep(currentStep);
  }

  // eslint-disable-next-line max-len
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["productForDateRangeAndLocationsExist","cartItemHasProductForDateRangeAndLocations"] }] */
  productForDateRangeAndLocationsExist(existingCartItems, orderDetails) {
    return existingCartItems.some(
      cartItem =>
        cartItem.products.findIndex(
          cartProduct => cartProduct.id === orderDetails.selectedProduct.id
        ) >= 0 &&
        moment(cartItem.period.start).isSame(
          moment(orderDetails.deliveryDate),
          "day"
        ) &&
        moment(cartItem.period.end).isSame(
          moment(orderDetails.collectionDate),
          "day"
        ) &&
        cartItem.location.collection.name ===
          orderDetails.collectionLocation.label &&
        cartItem.location.delivery.name === orderDetails.deliveryLocation.label
    );
  }

  // eslint-disable-next-line max-len
  cartItemHasProductForDateRangeAndLocations(cartItem, orderDetails) {
    return (
      cartItem.products.findIndex(
        cartItemProduct =>
          cartItemProduct.id === orderDetails.selectedProduct.id
      ) >= 0 &&
      moment(cartItem.period.start).isSame(
        moment(orderDetails.deliveryDate),
        "day"
      ) &&
      moment(cartItem.period.end).isSame(
        moment(orderDetails.collectionDate),
        "day"
      ) &&
      cartItem.location.collection.name ===
        orderDetails.collectionLocation.label &&
      cartItem.location.delivery.name === orderDetails.deliveryLocation.label
    );
  }

  addToCart() {
    const order = new Order().returnOrder();

    let existingItems = this.props.cartReducer.items;

    let mergedItems = [];
    if (this.productForDateRangeAndLocationsExist(existingItems, order)) {
      mergedItems = existingItems.map(cartItem => {
        if (this.cartItemHasProductForDateRangeAndLocations(cartItem, order)) {
          cartItem.products.map(cartItemProduct => {
            if (cartItemProduct.id === order.selectedProduct.id) {
              cartItemProduct.quantity += order.productQuantity;
              if (cartItemProduct.accessories) {
                order.productOptionalAccessories.map(productAccessory => {
                  if (
                    productAccessory.quantity > 0 &&
                    cartItemProduct.accessories.some(
                      accessory => accessory.id === productAccessory.id
                    )
                  ) {
                    cartItemProduct.accessories.map(existingAccessory => {
                      if (existingAccessory.id === productAccessory.id) {
                        existingAccessory.quantity += productAccessory.quantity;
                      }
                    });
                  } else if (productAccessory.quantity > 0) {
                    cartItemProduct.accessories.push(productAccessory);
                  }
                });
              } else {
                cartItemProduct.accessories.push(
                  order.productOptionalAccessories.map(
                    accessory => accessory.quantity > 0
                  )
                );
              }
            } else {
              return cartItemProduct;
            }
          });
          return cartItem;
        }
        return cartItem;
      });
    }

    if (mergedItems.length === 0) {
      existingItems = [...existingItems, order.orderRequest];
    } else {
      existingItems = mergedItems;
    }

    this.props.setCart(existingItems);
    localStorage.setItem("cart", JSON.stringify(existingItems));
    this.props.setCurrentStep(5);
  }

  changeAccesoire(val) {
    const index = this.state.accessories.findIndex(
      item => item.id === JSON.parse(val.dropdown).id
    );
    this.state.accessories[index] = JSON.parse(val.dropdown);
    this.setState({ accessories: this.state.accessories });
  }

  onChangeConfiguration(val) {
    const index = this.state.configurations.findIndex(
      item => item.id === JSON.parse(val.configuration).id
    );
    this.state.configurations[index] = JSON.parse(val.configuration);
    this.setState({ configurations: this.state.configurations });
  }

  nextButton() {
    if (
      this.props.localSearchReducer.currentStep <
      this.props.localSearchReducer.totalSteps
    ) {
      return (
        <button className="next-button" type="button" onClick={this._next}>
          Next
        </button>
      );
    }
    // ...else render nothing
    return null;
  }

  previousButton() {
    // If the current step is not 1, then render the "previous" button
    if (this.props.localSearchReducer.currentStep !== 1) {
      return (
        <button className="previous-button" type="button" onClick={this._prev}>
          Previous
        </button>
      );
    }
    // ...else return nothing
    return null;
  }

  addProdcut(product) {
    product.qty += 1;
    this.setState({
      products: this.state.products
    });
  }

  removeProdcut(product) {
    if (product.qty > 0) {
      product.qty -= 1;
    }
    this.setState({
      products: this.state.products
    });
  }

  onImageClicked(selectedProductUrl) {
    this.setState({
      selectedProductUrl
    });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  setStep(step) {
    this.setState({ step });
  }

  setCartItemIndex(cartItemIndex) {
    this.setState({ cartItemIndex });
  }

  setRequestedAndOpenModal(item) {
    console.log(item);
    this.setState({
      modalIsOpen: true,
      requestedProduct: item,
      step: 1
    });
  }

  render() {
    const { product, accessories } = this.state;
    if (product) {
      return (
        <div>
          <a
            href={`/product-group?id=${product.productGroup.id}&slug=${slugify(
              product.productGroup.name
            )}`}
            as={`/product-group/${product.id}/${slugify(
              product.productGroup.name
            )}`}
            style={{ position: "absolute", left: "25px", top: "65px" }}
          >
            <img
              style={{
                height: "35px",
                position: "relative",
                cursor: "pointer"
              }}
              src="/static/images/back.png"
            ></img>
          </a>
          {product.images &&
            product.images.length > 0 &&
            product.images[0].fullImageUrl && (
              <div
                className="fullWidthImage"
                style={{
                  backgroundImage: `url(${product.images[0].fullImageUrl})`
                }}
              ></div>
            )}
          <div className="container">
            <div className="row" style={{ marginTop: "60px" }}>
              <div
                style={{ maxHeight: "100vh" }}
                className="col-lg-8 col-sm-12"
              >
                <div className="images">
                  <div className="main-image">
                    <img
                      src={
                        this.state.selectedProductUrl
                          ? this.state.selectedProductUrl
                          : ""
                      }
                    />
                    {/* <img src={product.images[0].url}></img> */}
                  </div>
                  <div className="small-images">
                    {product.images &&
                      product.images.map(productImage => {
                        return (
                          <img
                            src={productImage.url}
                            onClick={e => {
                              this.onImageClicked(productImage.url);
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
              <div
                style={{
                  overflow: "scroll"
                }}
                className="col-lg-4 col-sm-12 product-detail-description"
              >
                <div
                  style={{
                    maxHeight: "70vh",
                    paddingBottom: "25px"
                  }}
                >
                  <h2>
                    <a style={{ color: "black" }} href="/">
                      Rental
                    </a>{" "}
                    >{" "}
                    <a
                      style={{ color: "black" }}
                      href={`/product-group?id=${
                        product.productGroup.id
                      }&slug=${slugify(product.productGroup.name)}`}
                      as={`/product-group/${product.id}/${slugify(
                        product.productGroup.name
                      )}`}
                    >
                      {" "}
                      {product.productGroup.name}
                    </a>{" "}
                    >{" "}
                    <span style={{ color: "#FAB900", fontSize: "20px" }}>
                      {product.name}
                    </span>
                  </h2>
                  <h1 className="main-title">{product.name}</h1>
                  <p>{product.description && product.description.summary}</p>
                  <div className="tag-line">
                    {product.description && product.description.tagline}
                  </div>

                  <div>
                    <strong>€ {product.rates[0].price}</strong> EUR
                    <div className="per-day-text">per day</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "32px",
                      marginBottom: "25px",
                      borderBottom: "solid 1.3px lightgrey",
                      paddingBottom: "25px"
                    }}
                  >
                    <div className="col-md-4 counter">
                      <div
                        onClick={() => this.removeProdcut(product)}
                        className="plus-minus"
                      >
                        -
                      </div>
                      <div className="value">{product.qty}</div>
                      <div
                        onClick={() => this.addProdcut(product)}
                        className="plus-minus"
                      >
                        +
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div
                        onClick={() => this.setRequestedAndOpenModal(product)}
                        className="add-btn"
                      >
                        <i className="icon-cart"></i> Add to booking
                      </div>
                    </div>
                  </div>
                  {product.description.section1 &&
                  product.description.section1.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/tag.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section1.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section1 &&
                  product.description.section1.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section1.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section2 &&
                  product.description.section2.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/note.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section2.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section2 &&
                  product.description.section2.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section2.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section3 &&
                  product.description.section3.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/question.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section3.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section3 &&
                  product.description.section3.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section3.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section4 &&
                  product.description.section4.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/attention.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section4.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section4 &&
                  product.description.section4.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section4.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section5 &&
                  product.description.section5.head ? (
                    <div style={{ display: "flex" }}>
                      <h1 style={{ lineHeight: "7px" }}>+</h1>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section5.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section5 &&
                  product.description.section5.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section5.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section6 &&
                  product.description.section6.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/award.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section6.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section6 &&
                  product.description.section6.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section6.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section7 &&
                  product.description.section7.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/dimensions.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section7.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section7 &&
                  product.description.section7.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section7.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section8 &&
                  product.description.section8.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/tag.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section8.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section8 &&
                  product.description.section8.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section8.paragraph
                      }}
                    />
                  ) : null}
                  {product.description.section9 &&
                  product.description.section9.head ? (
                    <div style={{ display: "flex" }}>
                      <img
                        style={{ height: "35px" }}
                        src="/static/images/tag.png"
                      ></img>
                      <h2 style={{ lineHeight: "7px" }}>
                        {product.description.section9.head}
                      </h2>
                    </div>
                  ) : null}
                  {product.description.section9 &&
                  product.description.section9.paragraph ? (
                    <div
                      style={{ marginBottom: "32px" }}
                      dangerouslySetInnerHTML={{
                        __html: product.description.section9.paragraph
                      }}
                    />
                  ) : null}
                </div>
                &nbsp;
              </div>
            </div>
          </div>

          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal.bind(this)}
            onRequestClose={this.closeModal.bind(this)}
            style={{
              overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#19303b",
                zIndex: 4002
              },
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                transform: "translate(-50%, -50%)",
                backgroundColor: "transparent",
                border: "none",
                width: "80%"
              }
            }}
            portalClassName="product-tile-modal"
          >
            {this.state.requestedProduct && this.state.step === 1 && (
              <ProductBookingForm
                setCartItemIndex={this.setCartItemIndex.bind(this)}
                closeModal={this.closeModal.bind(this)}
                setStep={this.setStep.bind(this)}
                product={this.state.requestedProduct}
                cartItemIndex={this.state.cartItemIndex}
              />
            )}
            {this.state.requestedProduct && this.state.step === 2 && (
              <ProductBookingSummary
                closeModal={this.closeModal.bind(this)}
                setStep={this.setStep.bind(this)}
                product={this.state.requestedProduct}
                cartItemIndex={this.state.cartItemIndex}
              />
            )}
          </Modal>
        </div>
      );
    } else {
      return (
        <div className="page-wrapper">
          <Loader />
        </div>
      );
    }
  }
}

const mapStateToProps = ({
  rootReducer,
  searchReducer,
  locationReducer,
  localSearchReducer,
  cartReducer
}) => {
  return {
    searchReducer,
    locationReducer,
    localSearchReducer,
    rootReducer,
    cartReducer
  };
};

export default connect(mapStateToProps, {
  updateLocalSearch,
  updateLocalSearchProductQuantity,
  updateCart,
  addToCart,
  setSelectedProduct,
  setProductAccessories,
  setProductMandatoryAccessories,
  setProductOptionalAccessories,
  setProductConfigurations,
  setTotalSteps,
  setCurrentStep,
  resetLocalSearch,
  setCart
})(DetailPage);
