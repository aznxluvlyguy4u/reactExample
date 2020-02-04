import Link from "next/link";
import React, { Component } from "react";
import slugify from "slugify";

class ProductTiles extends Component {
  constructor(props) {
    super(props);
    this.props.products.forEach(product => {
      product.qty = 0;
    });
    this.state = {
      products: this.props.products
    };
  }

  addProdcut(product) {
    product.qty += 1;
    this.setState({
      products: this.state.products
    });
  }

  removeProdcut(product) {
    if (product.qty > 0) {
      product.qty -= 1;
    }
    this.setState({
      products: this.state.products
    });
  }

  render() {
    return (
      <div>
        {this.state.products && this.state.products.length > 0 && (
          <div className="row">
            <div className="col">
              <div className="row products">
                <div className="col-md-12">
                  <div className="row">
                    {this.state.products.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="col-lg-4 col-md-4 col-sm-6 product-tile"
                        >
                          <Link>
                            <a
                              href={`/product?id=${item.id}&slug=${slugify(
                                item.name
                              )}`}
                              as={`/product/${item.id}/${slugify(item.name)}`}
                            >
                              <div className="product-img">
                                <img
                                  style={{
                                    width: "100%",
                                    height: "214px",
                                    objectFit: "cover"
                                  }}
                                  alt={item.name}
                                  src={
                                    item.images[0].url != "ui/product.png"
                                      ? item.images[0].url
                                      : "/static/images/flyboard.png"
                                  }
                                />
                              </div>
                            </a>
                          </Link>
                          <h4>{item.name}</h4>
                          <hr></hr>
                          <div className="description">
                            {item.description.dimensions
                              ? item.description.dimensions
                              : "Test description"}
                          </div>

                          <div className="tag-line">tagline</div>

                          <div>
                            <strong>€ {item.rates[0].price}</strong>EUR
                            <div className="per-day-text">per day</div>
                          </div>
                          <div style={{ display: "flex" }}>
                            <div className="col-md-4 counter">
                              <div
                                onClick={() => this.removeProdcut(item)}
                                className="plus-minus"
                              >
                                -
                              </div>
                              <div className="value">{item.qty}</div>
                              <div
                                onClick={() => this.addProdcut(item)}
                                className="plus-minus"
                              >
                                +
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="add-btn">
                                <i className="icon-cart"></i>
                                Add to booking
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ProductTiles;
