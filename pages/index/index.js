import React from 'react';
import Default from '../../layouts/default';
import './index.scss';
import SearchFormWrapper from '../../components/searchComponents/searchFormWrapper';
import CategoryTiles from '../../components/category/categoryTiles';

const meta = { title: 'OCEAN PREMIUM - Water toys anytime anywhere.', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' };

const IndexPage = () => (
  <Default meta={meta}>
    <div className="background-wrapper" />
    <SearchFormWrapper />
    <CategoryTiles />
  </Default>
);

export default IndexPage;
