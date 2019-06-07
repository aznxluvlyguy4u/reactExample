import React, { Component } from 'react';
import './checkoutitem.scss';
import moment from 'moment';
import { Collapse } from 'react-collapse';

class CheckoutItem extends Component {
  constructor(props) {
    super(props);
    this.state = { accesoryprice: 0, collapse: false };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  returnWarningMessage() {
    if (this.props.data) {
      switch (this.props.data.availabilityState) {
        case 'AVAILABLE_BUT_DELAYED':
          return (
            <div className="warning-message">
          Items are available but might not reach selected Delivery location on time. Please contact/call the office to arrange a dedicated delivery on-board’
            </div>
          );
        default:
          return null;
      }
    }
  }

  returnExtraAccessories() {
    if (this.props.data.accessories) {
      let price = 0;
      this.props.data.accessories.map(e => price += Number(e.totalPrice));
      // this.setState({ accesoryprice: price });
      return (
        <div className="paragraph">
          <h3>Extra accessories</h3>
          <div className="content-wrapper">
            <div className="first">{this.props.data.accessories.map(e => `${e.quantity}x ${e.name}`).join(', ')}</div>
            <div className="second">{`€${price}`}</div>
          </div>
        </div>
      );
    }
  }

  toggleCollapse() {
    this.setState(prevState => ({
      collapse: !prevState.collapse,
    }));
  }

  render() {
    if (this.props.data) {
      return (
        <div className="checkoutitem">
          <div className="wrap-item">
            <div className="sub-item">
              x
              <div className="column-item">
                <span>{this.props.data.name}</span>
                <img src={this.props.data.images[0].thumbnailUrl} height="50" width="80" />
              </div>
            </div>
            <div className="sub-item">{this.props.data.quantity}</div>
            <div className="sub-item">{`€${this.props.data.totalPrice}`}</div>
            <div className="sub-item">
              <div className="column-item date">
                <span>{moment(this.props.data.period.start).format('DD.MM.YYYY')}</span>
                <span>{this.props.data.location.delivery.name}</span>
              </div>
            </div>
            <div className="sub-item">
              <div className="column-item date">
                <span>{moment(this.props.data.period.end).format('DD.MM.YYYY')}</span>
                <span>{this.props.data.location.collection.name}</span>
              </div>
            </div>
            <div className="sub-item">{this.props.data.availabilityState}</div>
            <div className="sub-item"><button onClick={this.toggleCollapse}>toggle</button></div>
          </div>
          {this.returnWarningMessage()}
          <Collapse className="collapse-view" isOpened={this.state.collapse}>
            <div className="paragraph-wrapper selection-overview">
              <div className="paragraph">
                <h3>Rental period</h3>
                <div className="content-wrapper">
                  <div className="first">
                    {`1 x €${this.props.data.rates[0].price}`}
                  </div>
                  <div className="second">
                    {`€${this.props.data.totalPrice}`}
                  </div>
                </div>
              </div>
              {/* ) : null} */}
              {this.props.data.accessories ? this.returnExtraAccessories() : null}
              <div className="paragraph no-line">
                <div className="content-wrapper">
                  <div className="first bold">Total Rental Price</div>
                  <div className="second bold">{`€${Number(this.props.data.totalPrice)}`}</div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutItem;
