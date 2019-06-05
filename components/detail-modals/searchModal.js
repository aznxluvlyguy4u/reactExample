import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import SearchEdit from '../searchedit/searchEdit';
import ConfigurationModal from './configurationModal';

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    console.log('close');
    this.setState({
      modalIsOpen: false,
    });
  }

  changeItem(val) {
    console.log(val);
  }

  render() {
    const {
      active, index, total, data, handleSubmit, currentStep,
    } = this.props;
    const { modalIsOpen } = this.state;
    if (currentStep && currentStep !== 1) { // Prop: The current step
      return null;
    }
    return (
      <div className={'active' ? 'form active' : 'form'}>
        {/* <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{`Current step: ${  this.props.currentStep}`}</h4>
        </div> */}
        <SearchEdit _prev={this.props._prev} _next={this.props._next} currentStep={this.props.currentStep} onChange={this.props.handleChange} label submit handleSubmit={handleSubmit} validation />
        {/* {!isEmpty(data.configurations) ? (
          <button type="button" onClick={this.toggleModal} className="configure">
            <i className="icon-cog" />
Advanced Configuration
          </button>
        ) : null} */}
        {/* <ConfigurationModal quantity={1} configurations={data.configurations} closeModal={this.closeModal} modalIsOpen={modalIsOpen} /> */}
      </div>
    );
  }
}

export default SearchModal;
