import React, { Component, Fragment } from 'react';
import Default from '../../layouts/default';
import Link from 'next/link';
import slugify from 'slugify';

import SearchFormWrapper from '../../components/searchComponents/searchFormWrapper';
import CategoryTiles from '../../components/category/categoryTiles';
import { getCategories } from '../../utils/rest/requests/categories';
import { getFirstProducts } from '../../utils/rest/requests/products';
import { handleGeneralError } from '../../utils/rest/error/toastHandler';

const meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };

class IndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
  }

  async componentDidMount() {
    await this.retrieveCategories();
  }

  async addProducts() {
    const test = this.state.categories.forEach((category, index) => {
      category.products = []
      this.loadProducts(category, index);
    })
    this.forceUpdate();
  }

  loadProducts = (category, index) => {
    setTimeout(() => {
      const test = getFirstProducts(category.id).then(response => {
        category.products = response.data;
        this.forceUpdate();
      });
    }, 800 * index )
  }

  async retrieveProducts(categoryId) {
    try {
      const response = await getFirstProducts(categoryId);
      return response.data;
    } catch (error) {
      handleGeneralError(error);
      return [];
    }
  }

  async retrieveCategories() {
    try {
      const response = await getCategories();
      this.setState({
        categories: response.data
      });
      this.addProducts();
    } catch (error) {
      this.setState({
        categories: []
      });
      handleGeneralError(error);
    }
  }

  render() {
    return (
      <Default meta={meta}>
        <div className="background-wrapper" />
        <SearchFormWrapper />
        <CategoryTiles categories={this.state.categories} />
        {this.state.categories.map((category, index) => {
          return (
            <Fragment>
              {category.products && category.products.length > 0 && <div className="searchresult-wrapper">
                <div className="search-block">
                  <div className="result-wrapper">
                    <div className="searchresult-title">
                      <h2>{category.name}</h2>
                      <span>Search through hundreds of Water Toys and add them to your trip!</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="result-wrapper">
                    <div className="ReactCollapse--content" style={{borderBottom: '1px dotted #ccc'}}>
                    {category.products && category.products.length > 0 &&
                      category.products.map((item, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/detail?id=${item.id}&slug=${slugify(item.name)}`}
                            as={`/detail/${item.id}/${slugify(item.name)}`}
                          >
                            <a>
                              <div className="result-item">
                                <img alt={item.name} src={item.images[0].fullImageUrl ? item.images[0].fullImageUrl : '/static/images/flyboard.png'} />
                                <h4>{item.name}</h4>
                              </div>
                            </a>
                          </Link>
                        )
                      })
                    }

                    </div>
                    <a href={`/search?category=${category.id}`} class="showmore">Show More &gt;</a>

                  </div>
                </div>
              </div>}
            </Fragment>
            )
        })}
      </Default>
    )
  }
}

export default IndexPage;
