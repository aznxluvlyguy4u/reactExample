import React, { Component } from "react";
import { connect } from "react-redux";
import LocalStorageUtil from "../../utils/localStorageUtil";
import ProductBookingRentalDetails from "./product-booking-rental-details";
import RecommendedProducts from "../recommended-products/recommendedProducts";
import { getRecomendedProductsByGroupIds } from "../../utils/rest/requests/products";

class ProductBookingSummary extends Component {
  constructor(props) {
    super(props);
    const cart = LocalStorageUtil.getCart() || [];
    this.state = {
      cart,
      recomendedProducts: [],
    };
  }

  async componentDidMount() {
    try {
      const recomendedProducts = await getRecomendedProductsByGroupIds([
        this.props.product.productGroup.id,
      ]);
      this.setState({
        recomendedProducts: recomendedProducts.data,
      });
    } catch (err) {
      this.setState({
        recomendedProducts: [],
      });
    }
  }

  render() {
    const recomendedProducts = this.state.recomendedProducts || [];

    return (
      <div className="row">
        <div className="col-md-7 equal-height-columns">
          <div className="row h-100 no-gutters">
            <div className="col-md-1 equal-height-columns">
              <img
                src="/static/images/back-arrow-white.svg"
                alt="previous"
                onClick={() => this.props.setStep(1)}
              />
            </div>
            <div className="col-md-11 equal-height-columns">
              <div className="white-bg h-100 p-5">
                <div className="row">
                  <div className="col-md-10">
                    <h1>Added to Booking</h1>
                  </div>
                  <div className="col-md-2 justify-content-center align-self-center">
                    <img
                      className="img-fluid align-middle"
                      src="/static/images/success.png"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <img
                      className="img-fluid"
                      alt={this.props.product.name}
                      src={this.props.product.images[0].url}
                    />
                  </div>
                  <div className="col-8">
                    <h3 className="main-title">
                      {this.props.product.description &&
                      this.props.product.description.section1 &&
                      this.props.product.description.section1.head
                        ? this.props.product.description.section1.head
                        : this.props.product.name}
                    </h3>
                    {this.props.product.description &&
                      this.props.product.description.tagline && (
                        <span class="description">
                          {this.props.product.description.tagline}
                        </span>
                      )}
                    {this.props.product && this.props.product.tagline && (
                      <div className="tag-line">
                        {this.props.product.tagline}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <hr className="page-divide" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12" style={{maxHeight: 350}}>
                    <h4>
                      People who selected this Item also added the following
                      Water Toys to their trip
                    </h4>
                    {recomendedProducts.length > 0 && (
                      <div style={{ position: "relative", top: "-65px" }}>
                        <RecommendedProducts slideNumber={2} products={recomendedProducts} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 equal-height-columns">
          <div className="white-bg h-100 p-5">
            <ProductBookingRentalDetails
              closeModal={() => this.props.closeModal()}
              product={this.props.product}
              cartItemIndex={this.props.cartItemIndex}
            ></ProductBookingRentalDetails>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(ProductBookingSummary);
