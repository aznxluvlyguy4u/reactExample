import React, { Component } from 'react';
import { isEmpty } from 'lodash';

class SummaryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  calculateTotalAccessoires() {
    const { accessories } = this.props;
    let price = 0;
    accessories.map(item => price += this.props.item.daysInterval * item.data.rates[0].price);
    return price;
  }

  render() {
    const {
      active, index, total, item, accessories,
    } = this.props;
    const totalPrice = this.calculateTotalAccessoires() + item.totalPrice;
    return (
      <div className={active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{`${index}/${total}`}</h4>
        </div>
        <div className="paragraph-wrapper">
          <div className="paragraph">
            <h3>Rental period</h3>
            <div className="content-wrapper">
              <div className="first">{`€${item.pricePerDay} x ${item.daysInterval} days`}</div>
              <div className="second">{`€${item.totalPrice}`}</div>
            </div>
          </div>
          {!isEmpty(accessories) ? (
            <div className="paragraph">
              <h3>Extra Accessories</h3>
              <div className="content-wrapper">
                <div className="first">{accessories.map(e => `${e.quanitity}x ${e.data.name}`).join(', ')}</div>
                <div className="second">{`€${this.calculateTotalAccessoires()}`}</div>
              </div>
            </div>
          ) : null}
          <div className="paragraph">
            <h3>Delivery fees</h3>
            <div className="content-wrapper">
              <div className="first">To be determined at Final Checkout!</div>
              <div className="second">€ -</div>
            </div>
          </div>
          <div className="paragraph">
            <div className="content-wrapper" />
            <div className="date-wrapper">
              <div className="date-element">
                <span>{item.startDate ? item.startDate.format('DD.MM.YYYY') : null}</span>
                <span>{item.startLocation ? item.startLocation.label : null}</span>
              </div>
              <div className="date-element">
                <img src="/static/images/arrow.png" height="7" width="40" />
              </div>
              <div className="date-element">
                <span>{item.endDate ? item.endDate.format('DD.MM.YYYY') : null}</span>
                <span>{item.endLocation ? item.endLocation.label : null}</span>
              </div>
            </div>
          </div>
          <div className="paragraph no-line">
            {/* <h3>Delivery fees</h3> */}
            <div className="content-wrapper">
              <div className="first bold">Total Rental Price</div>
              <div className="second bold">{`€${totalPrice.toFixed(2)}`}</div>
            </div>
          </div>
          <button className="search-button-full">Add to cart</button>
        </div>
      </div>
    );
  }
}

export default SummaryModal;
