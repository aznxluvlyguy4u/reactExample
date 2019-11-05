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
        <div className="background-wrapper"></div>
        <SearchFormWrapper />
        <CategoryTiles categories={this.state.categories} />

        <div className="container">
          {this.state.categories.map((category, index) => {
            return (
              <Fragment>
              {index === 1 || index === 3 ?

                <div className="row">
                  <div className="col banner">
                    {index === 1 &&
                      <Link
                      href="/call-to-action1"
                      >
                        <a>
                          <img src="/static/images/banner-mock1.png" />
                        </a>
                    </Link>
                    }
                    {index === 3 &&
                      <Link
                      href="/call-to-action2"
                      >
                        <a>
                          <img src="/static/images/banner-mock2.png" />
                        </a>
                    </Link>
                    }

                  </div>
                </div>
              :
              <div className="row">
                <div className="col">
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="section-title">{category.name}</h2>
                      <span>Search through hundreds of Water Toys and add them to your trip!</span>
                    </div>
                  </div>
                  <div className="row products">
                    <div className="col-md-12">
                      <div className="row">
                          {category.products && category.products.length > 0 &&
                            category.products.map((item, index) => {
                              return (
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                  <Link
                                    key={index}
                                    href={`/detail?id=${item.id}&slug=${slugify(item.name)}`}
                                    as={`/detail/${item.id}/${slugify(item.name)}`}
                                  >
                                    <a>
                                      <div className="product">
                                        <img alt={item.name} src={item.images[0].fullImageUrl ? item.images[0].fullImageUrl : '/static/images/flyboard.png'} />
                                        <h4>{item.name}</h4>
                                        {/* <span>
                                          {`from € ${item.rates.day_rate}`}
                                        </span> */}
                                      </div>
                                    </a>
                                  </Link>
                                </div>
                              )
                            })
                          }
                        </div>
                        < div className="row">
                          <div className="col">
                            <a href={`/search?category=${category.id}`} class="showmore">
                              Show More &gt;
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div> }

              </Fragment>

              )

          })
        }

        </div>
      </Default>
    )
  }
}

export default IndexPage;
