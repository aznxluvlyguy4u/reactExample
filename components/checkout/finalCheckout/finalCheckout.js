import React, { Component } from 'react';
import './finalcheckout.scss';
import Modal from 'react-modal';
import Router from 'next/router';
import CheckoutItem from '../checkoutItem/checkoutItem';
import OrderForm from '../orderForm/orderForm';
import PlaceOrderRequest from '../../../utils/mapping/products/placeOrderRequest';
import { orderCartItems } from '../../../utils/rest/requests/orders';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


class FinalCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false, loading: false,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cart !== this.props.cart) {
      this.setPrice();
    }
  }

  setPrice() {
    let price = 0;
    this.props.cart.map((item) => {
      price += parseFloat(item.totalPrice);
    });
    this.setState({ totalPrice: parseFloat(price).toFixed(2) });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  async handleSubmit(values) {
    const request = new PlaceOrderRequest(this.props.cart, values).returnOrder();
    console.log(request);
    try {
      this.setState({ loading: true });
      const response = await orderCartItems(request);
      this.props.emptyCart();
      this.closeModal();
      this.setState({ loading: false });
      console.log(response);
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
    // localStorage.removeItem('cart');
  }

  render() {
    return (
      <div className="final-checkout">
        <h2>Final Checkout</h2>
        <div className="header-row">
          <div className="sub-item" />
          <div className="sub-item product">Product</div>
          <div className="sub-item quantity">Quantity</div>
          <div className="sub-item price">Price</div>
          <div className="sub-item delivery">Delivery</div>
          <div className="sub-item collection">Collection</div>
          <div className="sub-item availability">Availability</div>
          <div className="sub-item details">Details</div>
        </div>
        {this.props.cart.map(item => <CheckoutItem removeItem={this.props.removeItem} data={item} />)}
        <div className="checkout-row">
          <button onClick={this.openModal} className="submit">Place order</button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <OrderForm loading={this.state.loading} handleSubmit={this.handleSubmit} />
        </Modal>
      </div>
    );
  }
}

export default FinalCheckout;