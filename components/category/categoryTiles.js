import Link from 'next/link';
import Carousel from 'nuka-carousel';
import React, { Component } from 'react';
import { getCategories } from '../../utils/rest/requests/categories';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';

class CategoryTiles extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], width: undefined };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  async componentDidMount() {
    await this.retrieveCategories();
    window.addEventListener('resize', this.useWindowWidth);
    this.useWindowWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({ width: window.innerWidth });
    return window.innerWidth;
  }

  async retrieveCategories() {
    try {
      const response = await getCategories();
      this.setState({
        categories: response.data.map((item, index) => (
          <Link href={`/search?category=${item.id}`} key={index}>
              <div
                className="category-tile"
              >
                <img src={item.customFields.publicIconThumbUrl} />
                <span>{item.name}</span>
              </div>
          </Link>
        )),
      });
    } catch (error) {
      handleGeneralError(error);
    }
  }

  render() {
    const { categories, width } = this.state;
    if (width) {
      return (
        <div className="category-wrapper">
          <h2>Something for everyone</h2>
          <Carousel
            autoplay
            autoplayInterval={2000}
            cellSpacing={20}
            dragging
            slidesToScroll={1}
            slidesToShow={Math.round(width / 250)}
            wrapAround
            renderBottomCenterControls={false}
          >
            { categories.map(category => category)}
          </Carousel>
        </div>
      );
    } return null;
  }
}

export default CategoryTiles;
