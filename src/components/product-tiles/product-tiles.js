import React, { Component } from "react";
import Modal from "react-modal";

import Link from "next/link";
import slugify from "slugify";

import styles from "./product-tiles.style";

import ProductBookingForm from "../product-booking-components/product-booking-form";

class ProductTiles extends Component {
  constructor(props) {
    super(props);

    this.props.products.forEach(product => {
      product.qty = 0;
    });

    this.state = {
      products: this.props.products,
      modalIsOpen: false,
      requestedProduct: undefined
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  setRequestedAndOpenModal(item) {
    this.state.requestedProduct = item;
    this.setState({
      modalIsOpen: true,
      requestedProduct: item
    });
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

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = "#f00";
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
                              : "--"}
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
                              <div
                                onClick={() =>
                                  this.setRequestedAndOpenModal(item)
                                }
                                className="add-btn"
                              >
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={styles}
          portalClassName="product-tile-modal"
        >
          {this.state.requestedProduct && (
            <div className="row">
              <div className="col-md-7 equal-height-columns">
                <div className="row no-gutters">
                  <div className="col-md-1 equal-height-columns">
                    <img
                      src="static/images/back-arrow-white.svg"
                      alt="previous"
                      onClick={this.closeModal}
                    />
                  </div>
                  <div className="col-md-11 equal-height-columns">
                    <div className="white-bg h-100 p-5">
                      <div className="row">
                        <div className="col-md-9">
                          <h3>Add {this.state.requestedProduct.name}</h3>
                          <p>Add to an existing booking or create a new one!</p>
                        </div>
                        <div className="col-md-3">
                          {this.state.requestedProduct.images.length > 0 && (
                            <img
                              className="img-fluid"
                              alt={this.state.requestedProduct.name}
                              src={this.state.requestedProduct.images[0].url}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <ProductBookingForm product={this.state.requestedProduct}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5 equal-height-columns">
                <div className="white-bg h-100 p-5">
                  <h3>Recommended Accessories</h3>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default ProductTiles;
