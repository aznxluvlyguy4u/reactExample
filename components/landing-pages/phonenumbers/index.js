import React, { Component } from 'react';
import './phonenumbers.scss';

class PhoneNumbers extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <div className="row">
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>Monaco | France</h4>
          <p>+377 640 62 95 99</p>
        </div>
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>Greece</h4>
          <p>+30 697 697 44 22</p>
        </div>
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>Italy</h4>
          <p>+39 339 253 80 59</p>
        </div>
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>Caribbean</h4>
          <p>+386 590 383 60</p>
        </div>
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>Spain</h4>
          <p>+34 655 394 826</p>
        </div>
        <div className="col">
          <div className="phoneIcon">
            <i className="icon-phone"></i>
          </div>
          <h4>ADRIATIC</h4>
          <p>+385 99 874 2000</p>
        </div>
      </div>
    )
  }
}
export default PhoneNumbers;
