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
    this.setState({
      modalIsOpen: false,
    });
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
        <SearchEdit _prev={this.props._prev} _next={this.props._next} currentStep={this.props.currentStep} onChange={this.props.handleChange} label submit handleSubmit={handleSubmit} validation />
        {!isEmpty(data.configurations) ? (
          <button type="button" onClick={this.toggleModal} className="configure">
            <i className="icon-cog" />
                Advanced Configuration
          </button>
        ) : null}
        <ConfigurationModal onChangeConfiguration={this.props.onChangeConfiguration} quantity={1} configurations={data.configurations} closeModal={this.closeModal} modalIsOpen={modalIsOpen} />
      </div>
    );
  }
}

export default SearchModal;
