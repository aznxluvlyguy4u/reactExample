import React, { Component } from "react";
import { scroller } from "react-scroll";
import Iframe from "react-iframe";
import classnames from "classnames";
import { withRouter } from 'next/router'

import Default from "../../layouts/default";
import Loader from "../../components/loader";
import ProductTiles from "../../components/product-tiles/product-tiles";

import { handleGeneralError } from "../../utils/rest/error/toastHandler";
import {
  getByGroupSlug,
  getProductGroupBySlug,
} from "../../utils/rest/requests/products";

const meta = {
  title: "Oceanpremium - Product Group",
  description:
    "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts",
};

class ProductGroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      error: null,
      selectedProduct: null,
      productGroup: null,
    };
  }

  static async getInitialProps(props) {
    return {};
  }

  async componentDidMount() {
    this.retrieveProductGroup().then().catch(err => {});
    this.retreiveProducts().then().catch(err => {});
    window.addEventListener("scroll", this.handleScroll);
  }

  async retrieveProductGroup() {
    try {
      // TODO: Hacky, but requested by client
      let slug = this.props.router.query.product_group_slug.replace("-rental", "");

      const productGroupRes = await getProductGroupBySlug(slug);
      if (!productGroupRes && !productGroupRes.data) return;

      const productGroup = productGroupRes.data[0];
      this.setState({ productGroup });
    } catch (error) {
      this.setState({
        categories: [],
      });
      handleGeneralError(error);
    }
  }

  async retreiveProducts() {
    const { router } = this.props;
    try {
      // TODO: Hacky, but requested by client
      let slug = router.query.product_group_slug.replace("-rental", "");
      const response = await getByGroupSlug(slug);

      if (response.data.length === 0) {
        this.setState({
          error: "No Products Found!",
        });
        return;
      }

      this.setState({
        products: response.data,
      });
    } catch (error) {
      console.log(error);
      //handleGeneralError(error);
      this.setState({
        error: "No Products Found!",
      });
    }
  }

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    let visible;
    if (currentScrollPos == 0) {
      visible = false;
    } else {
      visible = true;
    }
    this.setState({
      visible,
    });
  };

  scrollTo() {
    scroller.scrollTo("scroll-to-element", {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }

  render() {
    const { products, error, productGroup } = this.state;
    const slug = this.props.slug;

    if (products) {
      return (
        <Default meta={meta} nav="fixed">
          <div
            className="prodcut-group-background"
            style={{
              backgroundImage:
                productGroup &&
                productGroup.images &&
                productGroup.images[0] &&
                productGroup.images[0].url
                  ? `url(${productGroup.images[0].url})`
                  : 'url("/static/images/product-group-static-img.png")',
            }}
          ></div>
          <div className="container">
            <div className="category-text" style={{width: "65%"}}>
              <h1 style={{ color: "white" }}>
                {(productGroup && productGroup.displayName) || slug} Rentals
              </h1>
              <h3></h3>
            </div>
          </div>
          <div style={{ position: "relative", top: "70px" }}>
            <div
              className={classnames("scroll-down-circle", {
                "display-none": !this.state.visible,
              })}
            >
              <img src="/static/images/Ellipse 2.png" />
            </div>
            <div
              className={classnames("scroll-down-arrow", {
                "display-none": !this.state.visible,
              })}
            >
              <img
                onClick={() => this.scrollTo()}
                src="/static/images/down-arrow.png"
              />
            </div>
          </div>
          <div name="scroll-to-element"></div>
          <div className="container">
            <div className="products-container">
              <h1 className="product-group-heading">
                Rent a {(productGroup && productGroup.displayName) || slug}
              </h1>
              <div className="row">
                <div className="col-sm-12 col-md-6 product-group-text">
                  {productGroup && productGroup.description && (
                    <div
                      className="text-group"
                      dangerouslySetInnerHTML={{
                        __html: productGroup.description,
                      }}
                    ></div>
                  )}
                </div>
                <div className="col-sm-12 col-md-6">
                  {productGroup && productGroup.video && (
                    <Iframe
                      url={productGroup.video.url}
                      width="100%"
                      height="355px"
                      display="initial"
                      position="relative"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="products-container">
              <h1 className="product-group-heading">{slug} Options</h1>
              <ProductTiles products={products} />
            </div>
          </div>
          <div className="container mb-5">
            <h1 className="product-group-heading">Gallery</h1>
            <div className="row">
              <div className="col-sm-12 col-md-6 product-group-text">
                {productGroup && productGroup.summary && (
                  <div className="text-group" dangerouslySetInnerHTML={{
                    __html: productGroup.summary,
                  }}></div>
                )}
              </div>
              <div className="col-sm-12 col-md-6">
                {productGroup && productGroup.images && (
                  <div
                    style={{
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "auto auto auto",
                    }}
                  >
                    {productGroup.images.map((product) => (
                      <img
                        key={product.url}
                        className="img-fluid"
                        style={{minHeight: 197.5}}
                        src={product.url}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col banner">
                <div className="grid">
                  <h2 className="banner-left-title heading">
                    Leaders in Water Toy Rentals
                  </h2>
                  <div className="banner-right-text">
                    With charter clients today often confirming their bookings
                    last minute it can be difficult to ensure that the right
                    water toys are available on-board. A fast response and
                    availability at short notice are two of the qualities we
                    pride ourselves in to make your life easier.
                  </div>
                </div>
                <img src="/static/images/banner-image-3.png" />
              </div>
            </div>
          </div>
        </Default>
      );
    }
    if (error) {
      return (
        <Default nav="fixed" meta={meta}>
          <div className="page-wrapper">
            <div style={{ textAlign: "center", marginTop: "150px" }}>
              <h1>{error}</h1>
              There are no products available
            </div>
          </div>
        </Default>
      );
    }
    return (
      <Default nav="fixed" meta={meta}>
        <div className="page-wrapper">
          <Loader />
        </div>
      </Default>
    );
  }
}

export default withRouter(ProductGroupPage);
