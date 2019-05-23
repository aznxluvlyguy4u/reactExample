import React, { Component } from 'react';
import SearchEdit from '../searchedit/searchEdit';
import ConfigurationModal from './configurationModal';
import {isEmpty} from 'lodash';

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
   modalIsOpen: false };
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

  render() {
    return (
      <div className={this.props.active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{this.props.index+'/'+this.props.total}</h4>
        </div>
        {!isEmpty(this.props.data.configurations) ? <button type="button" onClick={this.toggleModal} className="configure">Advanced Configuration</button> : null}
        <SearchEdit label submit handleSubmit={this.props.handleSubmit} validation />
        <ConfigurationModal quantity={1} configurations={this.props.data.configurations} closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} />
      </div>
    );
  }
}

export default SearchModal;
