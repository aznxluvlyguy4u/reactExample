import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import rootReducer from '../../reducers/rootReducer';

class SummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = { dayCount: 0 };
  }

  componentDidMount() {
    const collectionDate = moment(this.props.search.collectionDate);
    const deliveryDate = moment(this.props.search.deliveryDate);
    console.log(collectionDate, deliveryDate);
    const daycount = collectionDate.diff(deliveryDate, 'days');
    this.setState({ dayCount: daycount });
  }

  calculateTotalAccessoires(list) {
    // const { accessories } = this.props;
    let price = 0;
    list.map(item => price += this.state.dayCount * Number(item.price));
    return price;
  }

  previousButton(currentStep) {
    // If the current step is not 1, then render the "previous" button
    if (currentStep !== 1) {
      return (
        <button
          className="previous-button"
          type="button"
          onClick={this.props._prev}
        >
        Previous
        </button>
      );
    }
    // ...else return nothing
    return null;
  }

  render() {
    console.log(this.props.search);
    const {
      accessories, search, product,
    } = this.props;
    const list = accessories.filter(item => item.quantity !== 0);
    const totalPrice = Number(product.rates[0].price) * this.state.dayCount;
    const totalRate = this.calculateTotalAccessoires(list) + totalPrice;
    return (
      <div className={'form active' ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>{`Add to cart`}</h3>
          <span>{this.props.currentStep+'/'+this.props.total}</span>
        </div>
        <div className="paragraph-wrapper">
          <div className="paragraph">
            <h3>Rental period</h3>
            <div className="content-wrapper">
              <div className="first">{`€${parseFloat(product.rates[0].price).toFixed(2)} x ${this.state.dayCount} days`}</div>
              <div className="second">{`€${parseFloat(totalPrice).toFixed(2)}`}</div>
            </div>
          </div>
          {!isEmpty(list) ? (
            <div className="paragraph">
              <h3>Extra Accessories</h3>
              <div className="content-wrapper">
                <div className="first">{list.map(e => `${e.quantity}x ${e.name}`).join(', ')}</div>
                <div className="second">{`€${this.calculateTotalAccessoires(list)}`}</div>
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
                <span>{search.deliveryDate ? moment(search.deliveryDate).format('DD.MM.YYYY') : null}</span>
                <span>{search.deliveryLocation ? search.deliveryLocation.name : null}</span>
              </div>
              <div className="date-element">
                <img src="/static/images/arrow.png" height="7" width="40" />
              </div>
              <div className="date-element">
                <span>{search.collectionDate ? moment(search.collectionDate).format('DD.MM.YYYY') : null}</span>
                <span>{search.collectionLocation ? search.collectionLocation.name : null}</span>
              </div>
            </div>
          </div>
          <div className="paragraph no-line">
            <div className="content-wrapper">
              <div className="first bold">Total Rental Price</div>
              <div className="second bold">{`€${totalRate.toFixed(2)}`}</div>
            </div>
          </div>
          <div className="button-wrapper">
            {this.previousButton(this.props.currentStep)}
            <button type="submit" onClick={this.props.handleSubmit} className="next-button">Add to cart</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(rootReducer)(SummaryView);
