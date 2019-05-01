import React from 'react';
import Default from '../../layouts/default';
import './index.scss';

const meta = { title: 'Oceanpremium - Shop', description: 'Index description' };

class IndexPage extends React.Component {
  render() {
    return (
      <Default meta={meta}>
        <div className="background-wrapper" />
      </Default>
    );
  }
}

export default IndexPage;
