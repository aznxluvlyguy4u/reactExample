import React, { Component } from "react";
import Link from "next/link";

import Carousel from "nuka-carousel";
import slugify from "slugify";

class RecommendedProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      width: undefined,
      dimensions: { width: 0 },
      slideNumber: props.slideNumber || 2,
    };
    this.container = { offsetWidth: 0 };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.useWindowWidth);

    setTimeout(() => {
      this.useWindowWidth();
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({
      width: window.innerWidth,
      dimensions: { width: this.container.offsetWidth },
    });

    return window.innerWidth;
  }

  product(item) {
    return (
      <div key={item.name} className="col-lg-3 col-md-4 col-sm-6 py-0 my-0">
        <a href={`/rent/${slugify(item.name)}-rental`}>
          <div
            style={{
              width: "100%",
              height: "100%",
              minWidth: 200,
              minHeight: 150,
              position: "relative",
            }}
          >
            <img
              className="img-fluid"
              style={{
                width: "100%",
                maxWidth: 319,
                height: 214,
                objectFit: "cover",
                zIndex: 10,
                borderRadius: 5,
              }}
              alt={item.name}
              src={
                item.imageThumbnail
                  ? item.imageThumbnail.url
                  : "/static/images/flyboard.png"
              }
            />
            <h4
              style={{
                minWidth: 200,
                textAlign: 'left'
              }}
            >
              {item.name}
            </h4>
          </div>
        </a>
      </div>
    );
  }

  toUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  slidesToShow() {
    if (!this.state.dimensions.width) return this.props.slideNumber || 2;

    if (this.state.dimensions.width < 800) {
      return 2;
    }

    if (this.state.dimensions.width < 1000) {
      return 3;
    }

    if (this.state.dimensions.width < 1100) {
      return 4;
    }

    return this.props.slideNumber || 2;
  }

  render() {
    const { products, width } = this.state;
    if (width) {
      return (
        <div
          className="container first-carousel"
          ref={(el) => (this.container = el)}
        >
          <div className="row">
            <div className="col" style={{ marginLeft: 0, paddingLeft: 0 }}>
              <div>
                <Carousel
                  className="category-tile"
                  autoplay
                  autoplayInterval={2000}
                  cellSpacing={20}
                  dragging
                  slidesToScroll={1}
                  slidesToShow={this.slidesToShow()}
                  wrapAround
                  renderCenterLeftControls={({ previousSlide }) => <div></div>}
                  renderCenterRightControls={({ nextSlide }) => <div></div>}
                  renderBottomCenterControls={({ currentSlide }) =>
                    (currentSlide = null)
                  }
                >
                  {this.props.products.map((product) => {
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
