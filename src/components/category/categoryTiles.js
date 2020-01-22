import Carousel from "nuka-carousel";
import React, { Component } from "react";

class CategoryTiles extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], width: undefined };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.useWindowWidth);
    this.useWindowWidth();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({ width: window.innerWidth });
    return window.innerWidth;
  }

  category(item, index) {
    return (
      <a href={`/search?category=${item.id}`} key={index}>
        <div className="category-tile">
          <img
            src={
              item.productGroups[0].customFields
                ? item.productGroups[0].customFields.publicIconThumbUrl
                : "/static/images/flyboard.png"
            }
          />
          <span>{item.name && this.toUpperCase(item.name)}</span>
        </div>
      </a>
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
              <h2>Something for Everyone</h2>
              <div className="slider-container">
                <Carousel
                  className="category-tile"
                  autoplay
                  autoplayInterval={2000}
                  cellSpacing={20}
                  dragging
                  slidesToScroll={1}
                  slidesToShow={5}
                  wrapAround
                  renderCenterLeftControls={({ previousSlide }) => (
                    <div className="left-arrow">
                      <img
                        src="/static/images/angle-left.png"
                        className="icon"
                        onClick={previousSlide}
                      />
                    </div>
                  )}
                  renderCenterRightControls={({ nextSlide }) => (
                    <div className="right-arrow">
                      <img
                        src="/static/images/angle-right.png"
                        className="icon"
                        onClick={nextSlide}
                      />
                    </div>
                  )}
                  renderBottomCenterControls={({ currentSlide }) =>
                    (currentSlide = null)
                  }
                >
                  {this.props.categories.map((category, index) => {
                    return this.category(category, index);
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
