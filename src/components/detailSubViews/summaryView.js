import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import rootReducer from '../../reducers/rootReducer';
import Steps from './steps';

class SummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = { dayCount: 1 };
  }

  componentDidMount() {
    const collectionDate = moment(this.props.localSearchReducer.search.collectionDate).endOf('day');
    const deliveryDate = moment(this.props.localSearchReducer.search.deliveryDate).startOf('day');
    const daycount = collectionDate.diff(deliveryDate, 'days');
    this.setState({ dayCount: daycount });
  }

  formatDate(date) {
    return moment(date).format('MM.DD.YYYY');
  }

  calculateTotalAccessoires(accessories) {
    // const { accessories } = this.props;
    let price = 0;
    accessories.map(item => {
      if(item.rates) {
        price += this.state.dayCount * Number(item.rates[0].price) * item.quantity
      }
    });
    return price;
  }


  previousButton() {
    // If the current step is not 1, then render the "previous" button
    if (this.props.localSearchReducer.currentStep !== 1) {
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

  accessorySubTotal(accessory) {
    let accessorySubTotal = 0;
    if(accessory.rates) {
      accessorySubTotal = Number(accessory.rates[0].price) * this.state.dayCount * accessory.quantity;
    }
    return accessorySubTotal;
  }

  render() {
    const accessories = this.props.localSearchReducer.productOptionalAccessories.filter(item => item.quantity !== 0);
    let totalPrice = 0;
    if(this.props.localSearchReducer.selectedProduct.rates) {
      totalPrice = Number(this.props.localSearchReducer.selectedProduct.rates[0].price) * this.state.dayCount * this.props.localSearchReducer.productQuantity;
    }
    const totalRate = this.calculateTotalAccessoires(accessories) + totalPrice;
    return (
      <div className={'form active' ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>{`Add to cart`}</h3>
          <Steps />
        </div>
        <div className="paragraph-wrapper">
          <div className="paragraph">
            <h3>Rental period</h3>
            <div className="content-wrapper" />
              <div className="date-wrapper">
                <div className="date-element">
                  <span>{this.props.localSearchReducer.search.deliveryDate ? this.formatDate(this.props.localSearchReducer.search.deliveryDate) : null}</span>
                  <span>{this.props.localSearchReducer.search.deliveryLocation.label ? this.props.localSearchReducer.search.deliveryLocation.value.name : null}</span>
                </div>
                <div className="date-element">
                  <img src="/static/images/arrow.png" height="7" width="40" />
                </div>
                <div className="date-element">
                  <span>{this.props.localSearchReducer.search.collectionDate ? this.formatDate(this.props.localSearchReducer.search.collectionDate) : null}</span>
                  <span>{this.props.localSearchReducer.search.collectionLocation.label ? this.props.localSearchReducer.search.collectionLocation.value.name : null}</span>
                </div>
              </div>
            </div>
          <div className="paragraph">
            <div className="content-wrapper">
              <div className="first"><h3>Chargeble period</h3></div>
              <div className="second"></div>
              <div className="third"><h3>{this.state.dayCount}</h3></div>
            </div>
          </div>

          <div className="paragraph">

            <div className="content-wrapper">
              <div className="first"><h3>Selected product</h3></div>
              <div className="second"></div>
              <div className="third"><h3>Subtotal</h3></div>
            </div>
            <div className="content-wrapper">
              <div className="first">{this.props.localSearchReducer.productQuantity} x {this.props.localSearchReducer.selectedProduct.name}</div>
    <div className="second">{this.props.localSearchReducer.productQuantity} x {this.props.localSearchReducer.selectedProduct.rates && <Fragment>€{parseFloat(this.props.localSearchReducer.selectedProduct.rates[0].price).toFixed(2)}</Fragment>} x {this.state.dayCount} days</div>
              <div className="third">{`€${parseFloat(totalPrice).toFixed(2)}`}</div>
            </div>
          </div>
          {!isEmpty(accessories) ? (
            <div className="paragraph">
              <div className="content-wrapper">
                <div className="first"><h3>Extra Accessories</h3></div>
                <div className="second"></div>
                <div className="third"><h3>Subtotal</h3></div>
              </div>
              {accessories.map(accessory => (
                <div className="content-wrapper">
                  <div className="first">{accessory.quantity} x {accessory.name}</div>
                <div className="second">{accessory.quantity} x {accessory.rates && <Fragment>€{parseFloat(accessory.rates[0].price).toFixed(2)}</Fragment>} X {this.state.dayCount} days</div>
                  <div className="third">€{parseFloat(this.accessorySubTotal(accessory)).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : null}
          <div className="paragraph">

            <div className="content-wrapper">
              <div className="first"><h3>Delivery fees</h3></div>
              <div className="last"><p>To be determined at Final Checkout!</p></div>
            </div>
          </div>

          <div className="paragraph no-line">
            <div className="content-wrapper">
              <div className="first bold">Total Rental Price</div>
              <div className="second"></div>
              <div className="third bold">{`€${totalRate.toFixed(2)}`}</div>
            </div>
          </div>
          <div className="button-wrapper">
            {this.previousButton()}
            <button
              type="submit"
              onClick={
              this.props.handleSubmit
              }
              className="next-button"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ rootReducer, localSearchReducer }) => {
  return {
    rootReducer,
    localSearchReducer
  };
};

export default connect(
  mapStateToProps, {
  }
)(SummaryView);
