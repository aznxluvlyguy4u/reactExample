import React, { Component } from 'react';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';

class CallToAction1Page extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <Default nav="fixed" search meta={{ title: 'Detail Page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
          <div className="fullWidthImage" style={{ backgroundImage: `url('https://picsum.photos/1900/400')` }} />

          <div className="container about">
            <div className="row">
              <div className="col-lg-12">
                <h1 className="main-title">Call to action 1</h1>
              </div>
            </div>

            <div className="row">
              <div className="col">

              </div>
            </div>
          </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(CallToAction1Page);
