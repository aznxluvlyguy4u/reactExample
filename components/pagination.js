import { Collapse } from 'react-collapse';
import React, { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const {
      children, total_page_count, current_page, onClick,
    } = this.props;
    return (
      <div>
        <Collapse isOpened className="result-wrapper">
          {children}
        </Collapse>
        {total_page_count > current_page ? <button className="showmore" onClick={onClick}>Show More (+4) ></button> : null}
      </div>
    );
  }
}

export default Pagination;
