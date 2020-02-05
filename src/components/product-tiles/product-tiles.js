import React, { Component } from "react";
import Modal from "react-modal";

import Link from "next/link";
import slugify from "slugify";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class ProductTiles extends Component {
  constructor(props) {
    super(props);
    this.props.products.forEach(product => {
      product.qty = 0;
    });
    this.state = {
      products: this.props.products,
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
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
                              <div onClick={this.openModal} className="add-btn">
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
          style={customStyles}
        >
          <div>
            <h2>Feature coming soon!</h2>
          </div>
          <button className="add-btn" onClick={this.closeModal}>
            Close
          </button>
        </Modal>
      </div>
    );
  }
}

export default ProductTiles;
