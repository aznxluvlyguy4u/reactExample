import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { updateAccessoryQuantityById } from "../../actions/localSearchActions";

class RecommendedAccessoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productOptionalAccessories: []
    };
  }

  componentDidMount() {
    this.setState({
      productOptionalAccessories: this.props.localSearchReducer
        .productOptionalAccessories
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.localSearchReducer.productOptionalAccessories !==
      this.props.localSearchReducer.productOptionalAccessories
    ) {
      this.setState({
        productOptionalAccessories: this.props.localSearchReducer
          .productOptionalAccessories
      });
    }
  }

  toggleSelect(index) {
    let productOptionalAccessories = this.state.productOptionalAccessories;
    productOptionalAccessories[index].selected = !this.state.productOptionalAccessories[index].selected;
    this.setState({ productOptionalAccessories });
    if (this.props.onSetSelectedUnselected) { 
      this.props.onSetSelectedUnselected(this.state.productOptionalAccessories[index]);
    }
  }

  render() {
    return (
      <div className="recommended-accessories" style={{maxHeight: "400px", overflow: "scroll"}}>
        {this.state.productOptionalAccessories.length > 0
          ? this.state.productOptionalAccessories.map((item, index) => (
              <div className="row mb-2 align-items-center">
                <div className="col-6">
                  {!item.selected && (
                    <div className="accessory-thumb">
                      <img
                        className="img-fluid"
                        src={
                          item.images && item.images[0].url
                            ? item.images[0].url
                            : item.imageThumbnail
                        }
                      />
                    </div>
                  )}
                  {item.selected && (
                    <div className="accessory-thumb active">
                      <img
                        className="img-fluid"
                        src={
                          item.images && item.images[0].url
                            ? item.images[0].url
                            : item.imageThumbnail
                        }
                      />
                      <img
                        className="tick"
                        src="/static/images/Selected-Yellow.png"
                      />
                      <p>Added to Booking</p>
                    </div>
                  )}
                </div>
                <div className="col-6">
                  <p className="title">{item.name}</p>
                  {item.rates.length > 0 && item.rates[0].price && (
                    <Fragment>
                      <p className="from">
                        From €{item.rates[0].price} {item.rates[0].chargePeriod.toLowerCase()}
                      </p>
                    </Fragment>
                  )}
                  {item.description &&
                    item.description.section1 &&
                    item.description.section1.paragraph && (
                      <Fragment>
                        <p>{item.description.section1.paragraph}</p>
                      </Fragment>
                    )}
                    {item.description &&
                    item.description.dimensions && (
                      <Fragment>
                        <p>{item.description.dimensions}</p>
                      </Fragment>
                    )}

                    {!item.selected && (
                      <button type="button" className="yellow-button-outline" onClick={() => this.toggleSelect(index)}>Select</button>
                    )}

                    {item.selected && (
                      <button type="button" className="yellow-button-outline active" onClick={() => this.toggleSelect(index)}>Remove</button>
                    )}
                </div>
              </div>
            ))
          : null}
      </div>
    );
  }
}

const mapStateToProps = ({ localSearchReducer }) => {
  return {
    localSearchReducer,
  };
};

export default connect(mapStateToProps, {
  updateAccessoryQuantityById,
})(RecommendedAccessoryView);
