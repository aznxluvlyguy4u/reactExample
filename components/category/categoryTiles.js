import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './categoryTiles.scss';
import Link from 'next/link';
import Carousel from 'nuka-carousel';
import { getCategories } from '../../utils/rest/requests/categories';

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
        categories: response.data.map(i => (
          <Link href={`/search?category=${i.id}`}>
            <a draggable="false">
              <div
                style={{ backgroundImage: 'url(/static/images/flyboard.png)' }}
                className="category-tile"
              >
                <span>{i.name}</span>
              </div>
            </a>
          </Link>
        )),
      });
    } catch (error) {
      console.log(error);
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
            withoutControls
            wrapAround
          >
            { categories.map(category => category)}
          </Carousel>
        </div>
      );
    } return null;
  }
}

export default CategoryTiles;
