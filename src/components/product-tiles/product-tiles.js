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

  setRequestedAndOpenModal(item) {
    console.log(item);
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
                          className="col-lg-4 col-md-4 col-sm-6 product-tile"
                        >
                          <Link>
                            <a
                              // href="#"
                              // onClick={e => {
                              //   e.preventDefault();
                              //   this.onProductClick(item);
                              // }}
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
                                {/* {item.rates[0].quantityAvailable == 0 && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      padding: "8px",
                                      backgroundColor: "rgb(255, 121, 7)",
                                      color: "white"
                                    }}
                                  >
                                    Currently unavailable
                                  </div>
                                )} */}
                              </div>
                            </a>
                          </Link>
                          <h4>{item.name}</h4>
                          <hr></hr>
                          <div className="description">
                            {item.description.section1
                              ? item.description.section1.paragraph
                              : "--"}
                            <div
                              style={{
                                position: "absolute",
                                top: "0px",
                                width: "100%",
                                height: "100%",
                                background:
                                  "linear-gradient(180deg, transparent, white)",
                                zIndex: "3"
                              }}
                            ></div>
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
