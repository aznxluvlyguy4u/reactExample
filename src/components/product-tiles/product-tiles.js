import React, { Component } from "react";
import Modal from "react-modal";

import Link from "next/link";
import slugify from "slugify";

import styles from "./product-tiles.style";

import ProductBookingForm from "../product-booking-components/product-booking-form";
import ProductBookingSummary from "../product-booking-components/product-booking-summary";

class ProductTiles extends Component {
  constructor(props) {
    super(props);

    this.props.products.forEach(product => {
      product.qty = 0;
    });

    this.state = {
      step: undefined,
      products: this.props.products,
      modalIsOpen: false,
      requestedProduct: undefined
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement("#openAddToBooking");
  }

  setRequestedAndOpenModal(item) {
    this.setState({
      modalIsOpen: true,
      requestedProduct: item,
      step: 1
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

  setStep(step) {
    this.setState({ step });
  }

  setCartItemIndex(cartItemIndex) {
    this.setState({ cartItemIndex });
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
                          className={this.props.search ? "col-lg-3 col-md-6 col-sm-6 product-tile" : "col-lg-4 col-md-6 col-sm-6 product-tile"}
                        >
                          <Link
                            href={`/product?id=${item.id}&slug=${slugify(
                              item.name
                            )}`}
                          >
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
                                    objectFit: "contain"
                                  }}
                                  alt={item.name}
                                  src={
                                    item.imageThumbnail ? item.imageThumbnail.url : "/static/images/flyboard.png" 
                                    // item.images[0].url != "ui/product.png"
                                    //   ? item.images[0].url
                                    //   : "/static/images/flyboard.png"
                                  }
                                />
                              </div>
                            </a>
                          </Link>
                          <h4 className="title">{item.name}</h4>
                          <hr style={{border: "0.292173px solid #C7C7C7"}}></hr>
                          <div className="description">
                            {item.description.tagline
                              ? item.description.tagline
                              : "--"}
                          </div>

                          {item.tagline && (
                            <div className="tag-line">{item.tagline}</div>
                          )}

                          <div className="currency">
                            <strong className="price">€ {item.rates[0].price}</strong> EUR
                            <div className="per-day-text">per day</div>
                          </div>
                          <div style={{ display: "flex" }}>
                            <div className="col-md-4 counter">
                              <div
                                onClick={() => this.removeProdcut(item)}
                                className="plus-minus"
                              >
                                {item.qty > 0 ? "-" : " "}
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
                                id="openAddToBooking"
                                onClick={() =>
                                  this.setRequestedAndOpenModal(item)
                                }
                                className="add-btn"
                              >
                                <i className="icon-cart"></i>
                              {" "}Add to booking
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
          {this.state.requestedProduct && this.state.step === 1 && (
            <ProductBookingForm
              setCartItemIndex={this.setCartItemIndex.bind(this)}
              closeModal={this.closeModal.bind(this)}
              setStep={this.setStep.bind(this)}
              product={this.state.requestedProduct}
              cartItemIndex={this.state.cartItemIndex}
            />
          )}
          {this.state.requestedProduct && this.state.step === 2 && (
            <ProductBookingSummary
              closeModal={this.closeModal.bind(this)}
              setStep={this.setStep.bind(this)}
              product={this.state.requestedProduct}
              cartItemIndex={this.state.cartItemIndex}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default ProductTiles;
