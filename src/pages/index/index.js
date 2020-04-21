import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { scroller } from "react-scroll";
import { createClient } from "contentful";
import * as config from "../../../config.json";

import Default from "../../layouts/default";
import SearchFormWrapper from "../../components/searchComponents/searchFormWrapper";
import CategoryTiles from "../../components/category/categoryTiles";
import Banner from "../../components/banner/banner";
import Tiles from "../../components/tiles/tiles";

import { getCategories } from "../../utils/rest/requests/categories";
import { handleGeneralError } from "../../utils/rest/error/toastHandler";

const meta = {
  title: "OCEAN PREMIUM - Water toys anytime anywhere.",
  description:
    "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
};

const client = createClient({
  space: config.space,
  accessToken: config.accessToken
});

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      bannerContent: [],
      visible: false
    };
  }

  async componentDidMount() {
    await this.retrieveCategories();
    await this.getBannerContent();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
      visible
    });
  };

  async addProducts() {
    this.state.categories.forEach((category, index) => {
      category.products = [];
    });
    this.forceUpdate();
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

  async getBannerContent() {
    try {
      const entries = await client.getEntries({
        content_type: "specialPageBannerModel",
        order: "-fields.orderNumber"
      });
      this.setState({ bannerContent: entries.items });
    } catch (error) {
      this.setState({
        bannerContent: []
      });
      handleGeneralError(error);
    }
  }

  scrollTo() {
    scroller.scrollTo("scroll-to-element", {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  render() {
    const categories = this.state.categories;
    const bannerContent = this.state.bannerContent;
    return (
      <Default meta={meta} ref={this.pageRef}>
        <div className="background-wrapper">
          <div className="background"></div>
          <div
            className={classnames("scroll-down-circle", {
              "display-none": !this.state.visible
            })}
          >
            <img src="/images/Ellipse 2.png" />
          </div>
          <div
            className={classnames("scroll-down-arrow", {
              "display-none": !this.state.visible
            })}
          >
            <img
              onClick={() => this.scrollTo()}
              src="/images/down-arrow.png"
            />
          </div>
          <SearchFormWrapper />
        </div>
        <div name="scroll-to-element"></div>
        <CategoryTiles categories={categories} />

        <div className="container">
          {categories &&
            categories.map((category, categoryIndex) => {
              return (
                <Fragment>
                  {bannerContent &&
                    bannerContent.map((bannerData, bannerIndex) => {
                      if (categoryIndex == 1 && bannerIndex == 0) {
                        return <Banner data={bannerData} />;
                      } else if (categoryIndex == 3 && bannerIndex == 1) {
                        return <Banner data={bannerData} />;
                      }
                    })}
                  <Tiles category={category} subHeading={true} />
                  {categoryIndex === this.state.categories.length - 1 && (
                    <div className="row">
                      <div className="col banner">
                        <div className="grid">
                          <h2 className="banner-left-title heading">
                            Leaders in Water Toy Rentals
                          </h2>
                          <div className="banner-right-text">
                            With charter clients today often confirming their
                            bookings last minute it can be difficult to ensure
                            that the right water toys are available on-board. A
                            fast response and availability at short notice are
                            two of the qualities we pride ourselves in to make
                            your life easier.
                          </div>
                        </div>
                        <img src="/images/banner-image-3.png" />
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
