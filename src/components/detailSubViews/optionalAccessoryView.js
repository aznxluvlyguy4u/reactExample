import React, { Component, Fragment } from 'react';
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
    }
  }

  componentDidMount() {

    this.setState({
      productOptionalAccessories: this.props.localSearchReducer.productOptionalAccessories,
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.localSearchReducer.productOptionalAccessories !== this.props.localSearchReducer.productOptionalAccessories) {
      this.setState({
        productOptionalAccessories: this.props.localSearchReducer.productOptionalAccessories
      })
    }
  }

  dayCount() {
    const collectionDate = moment(this.props.localSearchReducer.search.collectionDate).endOf('day');
    const deliveryDate = moment(this.props.localSearchReducer.search.deliveryDate).startOf('day');
    const daycount = collectionDate.diff(deliveryDate, 'days');
    return daycount;
  }

  render() {
    return (
      <ul className="accessories">
        {this.state.productOptionalAccessories.length > 0 ? this.state.productOptionalAccessories.map((item, index) =>
          (
            <li key={index}>
              {/* <div className="thumbnailImage" style={{ backgroundImage: `url(${item.images[0].thumbnailUrl})` }} /> */}
              {/* <img src={item.images[0].thumbnailUrl} /> */}
              {item.images &&
                <Fragment>
                  <div
                    className="extraAccessoryImage"
                    style={{
                    float:' left',
                    backgroundImage: `url(${ item.images && item.images[0] && item.images[0].thumbnailUrl})`,
                    backgroundSize: 'cover',
                  }} />
                </Fragment>
              }

              <span className="description">
                <span className="title">{item.name}</span>
                <br />
                {item.description && item.description.summary && item.description.summary}
              </span>
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
                  <span className="quantity">{item.quantity}</span>
                  <br />
                  {item.rates.length > 0 && item.rates[0].price &&
                    <Fragment>
                      €{parseFloat(item.quantity * Number(item.rates[0].price))}
                    </Fragment>
                  }
                   <br />
                  <span className="pricePerDayLabel">price per day</span>

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
