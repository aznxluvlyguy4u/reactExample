import React from 'react';
import Default from '../../layouts/default';
import '../index/index.scss';

const meta = { title: 'Oceanpremium - Test', description: 'Index description' };

const SearchPage = () => (
  <Default nav="fixed" search meta={meta} />
);

export default SearchPage;
