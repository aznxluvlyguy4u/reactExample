import { Component } from 'react';
import SearchEdit from '../searchedit/searchEdit';

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className={this.props.active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Add to cart</h3>
          <h4>{this.props.index+'/'+this.props.total}</h4>
        </div>
        <SearchEdit label submit handleSubmit={this.props.handleSubmit} validation />
      </div>
    );
  }
}

export default SearchModal;
