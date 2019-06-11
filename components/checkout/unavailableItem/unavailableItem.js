import React, { Component } from 'react';
import moment from 'moment';
import { Collapse } from 'react-collapse';

class UnavailableItem extends Component {
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

  returnAvailabilityIcon() {
    switch (this.props.data.availabilityState) {
      case 'AVAILABLE':
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
                <div className="column-item">
                  <span>{this.props.data.name}</span>
                  {this.props.data.images ? <img src={this.props.data.images[0].thumbnailUrl} height="50" width="80" /> : null}
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
              <div className="sub-item">{this.returnAvailabilityIcon()}</div>
              <div className="sub-item">
                <div />
              </div>
            </div>
            {this.returnWarningMessage()}
            <Collapse className="collapse-view" isOpened={this.state.collapse}>
              <div className="paragraph-wrapper selection-overview">
                <div className="paragraph">
                  <h3>Rental period</h3>
                  <div className="content-wrapper">
                    <div className="first">
                      {`1 x €${this.props.data.totalPrice}`}
                    </div>
                    <div className="second">
                      {`€${this.props.data.totalPrice}`}
                    </div>
                  </div>
                </div>
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
        </div>
      );
    }
    return null;
  }
}

export default UnavailableItem;
