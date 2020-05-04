import React, { Component } from "react";
// import Link from "next/link";

import Carousel from "nuka-carousel";
import slugify from "slugify";

class CategoryTiles extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], width: undefined, slideNumber: 5 };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.useWindowWidth);
    this.useWindowWidth();
    if (window.innerWidth < 1025) {
      this.state.slideNumber = 3;
    } else if (window.innerWidth < 678) {
      this.state.slideNumber = 2;
    } else {
      this.state.slideNumber = 5;
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({ width: window.innerWidth });
    return window.innerWidth;
  }

  category(item) {
    return (
      // <Link>
        <a
          href={`/category?id=${item.id}&slug=${slugify(item.name)}`}
          as={`/category/${item.id}/${slugify(item.name)}`}
          key={item.id}
        >
          <div className="category-tile">
            <img
              src={
                item.images.length
                  ? item.imageThumbnail.url
                  : "/static/images/flyboard.png"
              }
            />
            <span>{item.name && this.toUpperCase(item.name)}</span>
          </div>
        </a>
      // </Link>
    );
  }

  toUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { categories, width } = this.state;
    if (width) {
      return (
        <div className="container first-carousel">
          <div className="row">
            <div className="col">
              <h2 className="heading">Something for Everyone</h2>
              <div className="slider-container">
                <Carousel
                  className="category-tile"
                  autoplay
                  autoplayInterval={2000}
                  cellSpacing={20}
                  dragging
                  slidesToScroll={1}
                  slidesToShow={this.state.slideNumber}
                  wrapAround
                  renderCenterLeftControls={({ previousSlide }) => (
                    <div className="left-arrow">
                      {/* <img
                        src="/static/images/angle-left.png"
                        className="icon"
                        onClick={previousSlide}
                      /> */}
                    </div>
                  )}
                  renderCenterRightControls={({ nextSlide }) => (
                    <div className="right-arrow">
                      {/* <img
                        src="/static/images/angle-right.png"
                        className="icon"
                        onClick={nextSlide}
                      /> */}
                    </div>
                  )}
                  renderBottomCenterControls={({ currentSlide }) =>
                    (currentSlide = null)
                  }
                >
                  {this.props.categories.map(category => {
                    return this.category(category);
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CategoryTiles;
