import React, { Component } from 'react';
import { isEmpty } from 'lodash';

class SummaryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  calculateTotalAccessoires() {
    let price = 0;
    this.props.accessories.map(item => price += this.props.item.daysInterval * item.data.rates[0].price);
    return price;
  }

  render() {
    return (
      <div className={this.props.active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{`${this.props.index}/${this.props.total}`}</h4>
        </div>
        <div className="paragraph-wrapper">
          <div className="paragraph">
            <h3>Rental period</h3>
            <div className="content-wrapper">
              <div className="first">{`€${this.props.item.pricePerDay} x ${this.props.item.daysInterval} days`}</div>
              <div className="second">{`€${this.props.item.totalPrice}`}</div>
            </div>
          </div>
          {!isEmpty(this.props.accessories) ? (
            <div className="paragraph">
              <h3>Extra Accessories</h3>
              <div className="content-wrapper">
                <div className="first">{this.props.accessories.map(e => `${e.quanitity}x ${e.data.name}`).join(', ')}</div>
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
                <span>{this.props.item.startDate ? this.props.item.startDate.format('DD.MM.YYYY') : null}</span>
                <span>{this.props.item.startLocation ? this.props.item.startLocation.label : null}</span>
              </div>
              <div className="date-element">
                <img src="/static/images/arrow.png" height="7" width="40" />
              </div>
              <div className="date-element">
                <span>{this.props.item.endDate ? this.props.item.endDate.format('DD.MM.YYYY') : null}</span>
                <span>{this.props.item.endLocation ? this.props.item.endLocation.label : null}</span>
              </div>
            </div>
          </div>
          <div className="paragraph no-line">
            {/* <h3>Delivery fees</h3> */}
            <div className="content-wrapper">
              <div className="first bold">Total Rental Price</div>
              <div className="second bold">{`€${this.calculateTotalAccessoires() + this.props.item.totalPrice}`}</div>
            </div>
          </div>
          <button className="search-button-full">Add to cart</button>
        </div>
      </div>
    );
  }
}

export default SummaryModal;
