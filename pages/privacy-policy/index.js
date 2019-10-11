import React, { Component } from 'react';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import PhoneNumbers from '../../components/landing-pages/phonenumbers/';

class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {

    return (
      <Default nav="fixed" search meta={{ title: 'Privacy policy | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <div className="about-wrapper">
            <h1>Privacy policy</h1>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(PrivacyPolicyPage);
