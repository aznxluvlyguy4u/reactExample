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

  render() {
    const {
      active, index, total, data, handleSubmit,
    } = this.props;
    const { modalIsOpen } = this.state;
    return (
      <div className={active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{`${index}/${total}`}</h4>
        </div>
        {!isEmpty(data.configurations) ? <button type="button" onClick={this.toggleModal} className="configure">Advanced Configuration</button> : null}
        <SearchEdit label submit handleSubmit={handleSubmit} validation />
        <ConfigurationModal quantity={1} configurations={data.configurations} closeModal={this.closeModal} modalIsOpen={modalIsOpen} />
      </div>
    );
  }
}

export default SearchModal;
