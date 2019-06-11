import React, { Component } from 'react';
import './finalcheckout.scss';
import Modal from 'react-modal';
import CheckoutItem from '../checkoutItem/checkoutItem';
import OrderForm from '../orderForm/orderForm';

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
      modalIsOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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


  render() {
    return (
      <div className="final-checkout">
        <h2>Final Checkout</h2>
        <div className="header-row">
          <div className="sub-item">Product</div>
          <div className="sub-item">Quantity</div>
          <div className="sub-item">Price</div>
          <div className="sub-item">Delivery</div>
          <div className="sub-item">Collection</div>
          <div className="sub-item">Availability</div>
          <div className="sub-item">Details</div>
        </div>
        {this.props.cart.map(item => <CheckoutItem removeItem={this.props.removeItem} data={item} />)}
        <div className="checkout-row"><button onClick={this.openModal} className="submit">Place order</button></div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <OrderForm />
        </Modal>
      </div>
    );
  }
}

export default FinalCheckout;
