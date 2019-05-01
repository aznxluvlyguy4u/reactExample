import React from 'react';
import Default from '../layouts/default';
import './index/index.scss';

const meta = { title: 'Oceanpremium - Test', description: 'Index description' };

class TestPage extends React.Component {
  render() {
    return (
      <Default nav="fixed" search meta={meta}>
        {/* <div className="background-wrapper" /> */}
      </Default>
    );
  }
}

export default TestPage;
