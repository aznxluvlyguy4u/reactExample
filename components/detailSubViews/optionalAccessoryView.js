import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Steps from './steps';
import localSearchReducer from '../../reducers/localSearchReducer';
import { updateAccessoryQuantityById } from '../../actions/localSearchActions';

class OptionalAccessoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productOptionalAccessories: [],
      dayCount: 0
    }
  }

  componentDidMount() {
    this.setState({
      productOptionalAccessories: this.props.localSearchReducer.productOptionalAccessories
    })
    const collectionDate = moment(this.props.localSearchReducer.search.collectionDate);
    const deliveryDate = moment(this.props.localSearchReducer.search.deliveryDate);
    const daycount = collectionDate.diff(deliveryDate, 'days');
  }

  componentDidUpdate(prevProps) {
    if(prevProps.localSearchReducer.productOptionalAccessories !== this.props.localSearchReducer.productOptionalAccessories) {
      this.setState({
        productOptionalAccessories: this.props.localSearchReducer.productOptionalAccessories
      })
    }
  }
  render() {
    return (
      <ul className="accessories">
        {this.state.productOptionalAccessories.length > 0 ? this.state.productOptionalAccessories.map((item, index) =>
          (
            <li>
              {/* <div className="thumbnailImage" style={{ backgroundImage: `url(${item.images[0].thumbnailUrl})` }} /> */}
              {/* <img src={item.images[0].thumbnailUrl} /> */}
              {/* <div style={{
                backgroundImage: `url(${item.selectedProduct.images[0].thumbnailUrl})`,
                backgroundSize: 'cover',
                width: '70px',
                height: '50px'
              }} /> */}
              <span className="description">{item.name}</span>
              <span className="counter">
                <button
                  className="subtract-button"
                  onClick={(e) => {
                    if (item.quantity > 0) {
                      this.props.updateAccessoryQuantityById({id: item.id, quantity: item.quantity - 1})
                    }
                  }}
                >
                  -
                </button>
                <span className="center">
                  <span class="quantity">{item.quantity}</span>
                  <br />
                  €{parseFloat(item.quantity * item.rates[0].price * this.state.daycount).toFixed(2)}
                </span>
                <button
                  className="add-button"
                  onClick={(e) => {
                    this.props.updateAccessoryQuantityById({id: item.id, quantity: item.quantity + 1})
                  }}
                >
                  +
                </button>
              </span>
            </li>
          )
        ) : null}
      </ul>
    );
  }
}

const mapStateToProps = ({ localSearchReducer }) => {
  return {
    localSearchReducer
  };
};

export default connect(
  mapStateToProps, {
    updateAccessoryQuantityById
  }
)(OptionalAccessoryView);
