import Link from 'next/link';
import Carousel from 'nuka-carousel';
import React, { Component } from 'react';


class CategoryTiles extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], width: undefined };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('resize', this.useWindowWidth);
    this.useWindowWidth();
  }

  category(item, index) {
    return (
      <a href={`/search?category=${item.id}`} key={index}>
        <div
          className="category-tile"
        >
          <img src={item.customFields.publicIconThumbUrl} />
          <span>{item.name}</span>
        </div>
    </a>
    )
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({ width: window.innerWidth });
    return window.innerWidth;
  }


  render() {
    const { categories, width } = this.state;
    if (width) {
      return (
        <div className="container first-carousel">
          <div className="row">
            <div className="col">
            <h2>Something for everyone</h2>
              <Carousel
                autoplay
                autoplayInterval={2000}
                cellSpacing={20}
                dragging
                slidesToScroll={1}
                slidesToShow={Math.round(width / 250)}
                wrapAround
                renderBottomCenterControls={() => {}}
              >
                { this.props.categories.map((category, index) => {
                    return this.category(category, index)
                })}
              </Carousel>
            </div>
          </div>
        </div>
      );
    } return null;
  }
}

export default CategoryTiles;
