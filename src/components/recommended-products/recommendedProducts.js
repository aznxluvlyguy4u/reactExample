import React, { Component } from "react";
import Link from "next/link";

import Carousel from "nuka-carousel";
import slugify from "slugify";

class RecommendedProducts extends Component {
  constructor(props) {
    super(props);
    this.state = { products: [], width: undefined, slideNumber: 5 };
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

  product(item) {
    return (
      <Link>
        <a
          href={`/product?id=${item.id}&slug=${slugify(item.name)}`}
          as={`/product/${item.id}/${slugify(item.name)}`}
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
      </Link>
    );
  }

  toUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { products, width } = this.state;
    if (width) {
      return (
        <div className="container first-carousel">
          <div className="row">
            <div className="col">
              <h3>
                People who searched for Jetskis also add the following Water
                Toys to their trip
              </h3>
              <div>
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
                    // <div className="left-arrow">
                    //   <img
                    //     src="/static/images/angle-left.png"
                    //     className="icon"
                    //     onClick={previousSlide}
                    //   />
                    // </div>
                    <div></div>
                  )}
                  renderCenterRightControls={({ nextSlide }) => <div></div>}
                  renderBottomCenterControls={({ currentSlide }) =>
                    (currentSlide = null)
                  }
                >
                  {this.props.products.map(product => {
                    return this.product(product);
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

export default RecommendedProducts;
