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
        <div
          className="category-tile"
          style={{ maxWidth: 200, minHeight: 240 }}
        >
          <img
            src={
              item.images.length
                ? item.imageThumbnail.url
                : "/static/images/flyboard.png"
            }
          />
          <span style={{ paddingLeft: 22, paddingRight: 32 }}>
            {item.name && this.toUpperCase(item.name)}
          </span>
        </div>
      </a>
      // </Link>
    );
  }

  toUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  slidesToShow() {
    if (!this.state.width) return 5;

    if (this.state.width < 800) {
      return 2;
    }

    if (this.state.width < 1000) {
      return 3;
    }

    if (this.state.width < 1100) {
      return 4;
    }

    return 5;
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
                  //cellSpacing={5}
                  dragging
                  slidesToScroll={1}
                  slidesToShow={this.slidesToShow()}
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
                  {this.props.categories.map((category) => {
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
