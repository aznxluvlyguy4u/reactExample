import React, { Component } from 'react';
import './checkoutitem.scss';
import moment from 'moment';
import { Collapse } from 'react-collapse';

class CheckoutItem extends Component {
  constructor(props) {
    super(props);
    this.state = { collapse: false };
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
        case 'AVAILABLE_BUT_ACCESSORY_NOT_AVAILABLE':
          return (
            <div className="warning-message">
          Items are available but not all accesories are available. Please contact/call the office to arrange a solution’
            </div>
          );
        default:
          return null;
      }
    }
  }

  returnExtraAccessories() {
    if (this.props.data.accessories) {
      return (
        <div className="paragraph">
          <h3>Extra accessories</h3>
          <div className="content-wrapper">
            <div className="first">{this.props.data.accessories.map(e => `${e.quantity}x ${e.name}`).join(', ')}</div>
            <div className="second">{`€${this.props.data.totalPriceAccessories}`}</div>
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

  returnAvailabilityIcon() {
    switch (this.props.data.availabilityState) {
      case 'AVAILABLE':
        return <img height="20" width="20" src="/static/images/available.png" />;
      case 'AVAILABLE_BUT_DELAYED':
        return <img height="20" width="20" src="/static/images/available.png" />;
      case 'AVAILABLE_BUT_ACCESSORY_NOT_AVAILABLE':
          return <img height="20" width="20" src="/static/images/available.png" />;
      case 'NOT_AVAILABLE':
        return <img height="20" width="20" src="/static/images/unavailable.png" />;
    }
  }

  render() {
    if (this.props.data) {
      return (
        <div className="body-row">
          <div className="checkoutitem">
            <div className="wrap-item">
              <div className="sub-item">
                <div onClick={() => this.props.removeItem(this.props.data.uuid)} className="remove-item">x</div>
              </div>
              <div className="sub-item product">
                <div className="column-item">
                  <span>{this.props.data.name}</span>
                  {this.props.data.images ? <img src={this.props.data.images[0].thumbnailUrl} height="50" width="80" /> : null}
                </div>
              </div>
              <div className="sub-item quantity">{this.props.data.quantity}</div>
              <div className="sub-item price">{`€${this.props.data.totalPrice}`}</div>
              <div className="sub-item delivery">
                <div className="column-item date">
                  <span>{moment(this.props.data.period.start).format('DD.MM.YYYY')}</span>
                  <span>{this.props.data.location.delivery.name}</span>
                </div>
              </div>
              <div className="sub-item collection">
                <div className="column-item date">
                  <span>{moment(this.props.data.period.end).format('DD.MM.YYYY')}</span>
                  <span>{this.props.data.location.collection.name}</span>
                </div>
              </div>
              <div className="sub-item availability">{this.returnAvailabilityIcon()}</div>
              <div className="sub-item details">
                <div className="toggle" onClick={this.toggleCollapse}>{this.state.collapse ? <img height="10" width="20" src="/static/images/up.png" /> : <img height="10" width="20" src="/static/images/down.png" />}</div>
              </div>
            </div>
            {this.returnWarningMessage()}
            <Collapse className="collapse-view" isOpened={this.state.collapse}>
              <div className="paragraph-wrapper selection-overview">
                <div className="paragraph">
                  <h3>Rental period</h3>
                  <div className="content-wrapper">
                    <div className="first">
                      {`1 x €${this.props.data.totalPriceProducts}`}
                    </div>
                    <div className="second">
                      {`€${this.props.data.totalPriceProducts}`}
                    </div>
                  </div>
                </div>
                {this.props.data.accessories ? this.returnExtraAccessories() : null}
                <div className="paragraph no-line">
                  <div className="content-wrapper">
                    <div className="first bold">Total Rental Price</div>
                    <div className="second bold">{`€${this.props.data.totalPrice}`}</div>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default CheckoutItem;
