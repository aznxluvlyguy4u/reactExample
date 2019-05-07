import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './categoryTiles.scss';
import Link from 'next/link';
import { getCategories } from '../../utils/rest/requests/categories';

const handleOnDragStart = e => e.preventDefault();
class CategoryTiles extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
    this.responsive = {
      0: { items: 1 },
      400: { items: 2 },
      700: { items: 3 },
      800: { items: 4 },
      1024: { items: 5 },
      1800: { items: 6 },
    };
  }

  async componentDidMount() {
    await this.retrieveCategories();
  }

  async retrieveCategories() {
    try {
      const response = await getCategories();
      this.setState({
        categories: response.data.product_groups.map(i => (
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
    const { categories } = this.state;
    return (
      <div className="category-wrapper">
        <h2>Something for everyone</h2>
        <AliceCarousel
          mouseDragEnabled
          duration={2000}
          items={categories}
          autoPlayInterval={5000}
          autoPlayDirection="rtl"
          autoPlay
          buttonsDisabled
          keysControlDisabled
          dotsDisabled
          responsive={this.responsive}
        />
      </div>
    );
  }
}

export default CategoryTiles;
