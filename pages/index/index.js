import React from 'react';
import Default from '../../layouts/default';
import './index.scss';
import SearchFormWrapper from '../../components/search/searchFormWrapper';
import CategoryTiles from '../../components/category/categoryTiles';

const meta = { title: 'Oceanpremium - Shop', description: 'Index description' };

const IndexPage = () => (
  <Default meta={meta}>
    <div className="background-wrapper" />
    <SearchFormWrapper />
    <CategoryTiles />
  </Default>
);

export default IndexPage;
