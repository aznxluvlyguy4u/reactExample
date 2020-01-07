import React, { Component } from 'react';
import { connect } from 'react-redux';

const color = '#FABA0C';
const size = 7;

const ulStyle = {
  listStyle: 'none',
  width: '90px',
  margin: '0px auto',
  display: 'inline'
}

const liStyle = {
  display: 'inline',
  margin: '2px'
}

const dot = {
  height: size + 'px',
  width: size + 'px',
  backgroundColor: '#ffffff',
  border: `1px solid ${color}`,
  borderRadius: '50%',
  display: 'inline-block'
}

const filledDot = {
  height: size + 'px',
  width: size + 'px',
  backgroundColor: color,
  border: `1px solid ${color}`,
  borderRadius: '50%',
  display: 'inline-block'
}

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {


    return (
      <div>
        <ul className="d-flex justify-content-between" style={ulStyle}>
          {Array.from(Array(this.props.localSearchReducer.totalSteps), (e, i) => {
            return <li key={i} style={liStyle}>
              <span style={this.props.localSearchReducer.currentStep <= i ?  dot : filledDot}></span>
            </li>
          })}
        </ul>
    </div>
    )
  }
}

const mapStateToProps = ({ localSearchReducer }) => {
  return {
    localSearchReducer
  };
};

export default connect(
  mapStateToProps, {
  }
)(Steps);
