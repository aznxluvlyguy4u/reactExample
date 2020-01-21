import React, { Component, Fragment } from "react";

import Default from "../../layouts/default";
import SearchFormWrapper from "../../components/searchComponents/searchFormWrapper";
import CategoryTiles from "../../components/category/categoryTiles";
import Banner from "../../components/banner/banner";
import Tiles from "../../components/tiles/tiles";

import { getCategories } from "../../utils/rest/requests/categories";
import { getFirstProducts } from "../../utils/rest/requests/products";
import { handleGeneralError } from "../../utils/rest/error/toastHandler";

const meta = {
  title: "OCEAN PREMIUM - Water toys anytime anywhere.",
  description:
    "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
};

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
  }

  async componentDidMount() {
    await this.retrieveCategories();
  }

  async addProducts() {
    const test = this.state.categories.forEach((category, index) => {
      category.products = [];
      this.loadProducts(category, index);
    });
    this.forceUpdate();
  }

  loadProducts = (category, index) => {
    setTimeout(() => {
      const test = getFirstProducts(category.id).then(response => {
        category.products = response.data;
        this.forceUpdate();
      });
    }, 800 * index);
  };

  async retrieveProducts(categoryId) {
    try {
      const response = await getFirstProducts(categoryId);
      return response.data;
    } catch (error) {
      handleGeneralError(error);
      return [];
    }
  }

  async retrieveCategories() {
    try {
      const response = await getCategories();
      this.setState({
        categories: response.data
      });
      this.addProducts();
    } catch (error) {
      this.setState({
        categories: []
      });
      handleGeneralError(error);
    }
  }

  render() {
    return (
      <Default meta={meta}>
        <div className="background-wrapper"></div>
        <SearchFormWrapper />
        <CategoryTiles categories={this.state.categories} />

        <div className="container">
          {this.state.categories.map((category, index) => {
            return (
              <Fragment>
                {index === 0 && (
                  <Banner
                    title="One-way Rentals"
                    subTitle=" Search through hundreds of Water Toys and add them to your trip!"
                    bannerText="Drop-off and Pick-ups are possible anytime anywhere"
                    bannerImg="/static/images/banner-image-1.png"
                  />
                )}
                {index === 2 && (
                  <Banner
                    title="Explore the Underwater World"
                    subTitle="A new addition to our collection of toys allows you to
                   explore the under water world in comfort."
                    bannerText=" Add a Personal Submiarine to your next Adventure!"
                    bannerImg="/static/images/banner-image-2.png"
                  />
                )}
                <Tiles category={category} />
                {index === this.state.categories.length - 1 && (
                  <div className="row">
                    <div className="col banner">
                      <div className="grid">
                        <h2 className="banner-left-title">
                          Leaders in Water Toy Rentals
                        </h2>
                        <div>
                          With charter clients today often confirming their
                          bookings last minute it can be difficult to ensure
                          that the right water toys are available on-board. A
                          fast response and availability at short notice are two
                          of the qualities we pride ourselves in to make your
                          life easier.
                        </div>
                      </div>
                      <img src="/static/images/banner-image-3.png" />
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Default>
    );
  }
}

export default IndexPage;
