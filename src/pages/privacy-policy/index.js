import React, { Component } from 'react';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';

class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {

    return (
      <Default nav="fixed" search meta={{ title: 'Privacy policy | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="container" style={{marginTop: '100px'}}>
          <div className="row">
            <div className="col">
              <h1 className="main-title">Privacy policy</h1>
            </div>
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(PrivacyPolicyPage);
