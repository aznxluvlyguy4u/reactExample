import React from 'react';
import Default from '../../layouts/default';
import './index.scss';
import SearchFormWrapper from '../../components/search/searchFormWrapper';

const meta = { title: 'Oceanpremium - Shop', description: 'Index description' };

const IndexPage = () => (
  <Default meta={meta}>
    <div className="background-wrapper" />
    <SearchFormWrapper />
  </Default>
);

export default IndexPage;
