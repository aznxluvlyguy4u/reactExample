import { Collapse } from 'react-collapse';
import { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div>
        <Collapse isOpened className="result-wrapper">
          {this.props.children}
        </Collapse>
        {this.props.total_page_count > this.props.current_page ? <button className="showmore" onClick={this.props.onClick}>Show More (+4) ></button> : null}
      </div>
    );
  }
}

export default Pagination;
