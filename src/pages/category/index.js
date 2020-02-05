import React, { Component } from "react";
import { scroller } from "react-scroll";
import classnames from "classnames";

import Default from "../../layouts/default";
import Loader from "../../components/loader";
import CategoryTiles from "../../components/category/categoryTiles";
import Tiles from "../../components/tiles/tiles";

import { handleGeneralError } from "../../utils/rest/error/toastHandler";
import { getCategories } from "../../utils/rest/requests/categories";

const meta = {
  title: "Oceanpremium - Categories",
  description:
    "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
};

class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      category: null,
      visible: false
    };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id)
    };
  }

  async componentDidMount() {
    await this.retrieveCategories();
    window.addEventListener("scroll", this.handleScroll);
  }

  async retrieveCategories() {
    const { id } = this.props;
    try {
      const response = await getCategories();
      this.setState({
        categories: response.data
      });
      response.data.forEach(category => {
        if (category.id === id) {
          this.setState({
            category: category
          });
        }
      });
    } catch (error) {
      handleGeneralError(error);
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
      visible
    });
  };

  scrollTo() {
    scroller.scrollTo("scroll-to-element", {
      duration: 500,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  render() {
    const { categories, category, visible } = this.state;
    console.log(category);
    if (category) {
      return (
        <Default meta={meta} nav="fixed">
          <div
            className="category-background"
            style={{
              backgroundImage: (category && category.images && category.images[0] && category.images[0].url) ? `url(${category.images[0].url})` : 'url("/static/images/static-category-img.png")'
            }}
          ></div>
          <div className="category-text">
            <h1 style={{ color: "white" }}>{category.name}</h1>
            <h3></h3>
          </div>
          <div>
            <div
              className={classnames("scroll-down-circle", {
                "display-none": this.state.visible
              })}
            >
              <img src="/static/images/Ellipse 2.png" />
            </div>
            <div
              className={classnames("scroll-down-arrow", {
                "display-none": this.state.visible
              })}
            >
              <img
                onClick={() => this.scrollTo()}
                src="/static/images/Vector 9.png"
              />
            </div>
          </div>
          <div name="scroll-to-element"></div>
          <div className="container tiles">
            <Tiles category={this.state.category} />
            <div style={{ position: "relative", paddingBottom: "20px" }}>
              <CategoryTiles categories={this.state.categories} />
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

export default CategoryPage;
