import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { scroller } from "react-scroll";

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

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      visible: false
    };
  }

  async componentDidMount() {
    await this.retrieveCategories();
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

  addProducts() {
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

  scrollTo() {
    scroller.scrollTo("scroll-to-element", {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  render() {
    return (
      <Default meta={meta} ref={this.pageRef}>
        <div className="background-wrapper">
          <div className="background"></div>
          <div
            className={classnames("scroll-down-circle", {
              "display-none": !this.state.visible
            })}
          >
            <img src="/static/images/Ellipse 2.png" />
          </div>
          <div
            className={classnames("scroll-down-arrow", {
              "display-none": !this.state.visible
            })}
          >
            <img
              onClick={() => this.scrollTo()}
              src="/static/images/Vector 9.png"
            />
          </div>
          <SearchFormWrapper />
        </div>
        <div name="scroll-to-element"></div>
        <CategoryTiles categories={this.state.categories} />

        <div className="container">
          {this.state.categories.map((category, index) => {
            return (
              <Fragment key={category}>
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
                <Tiles category={category} subHeading={true} />
                {index === this.state.categories.length - 1 && (
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
