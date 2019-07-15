import React, { Component } from 'react';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import PhoneNumbers from '../../components/landing-pages/phonenumbers';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {

    return (
      <Default nav="fixed" search meta={{ title: 'Detail Page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <div className="fullWidthImage" style={{ backgroundImage: `url('static/images/about.png')` }} />
          <div className="contact-wrapper">
            <h1>Contact</h1>
             <div className="col-left">
              <p>Feel free to contact any of our offices for any questions ypu have 24/7.</p>
              <img src="static/images/barbara.png" />
            </div>

            <div className="col-right">
              Form goes here
            </div>
            <PhoneNumbers />

          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(AboutPage);
