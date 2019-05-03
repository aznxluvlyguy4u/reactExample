// components/meta.js

import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';

const Meta = ({ props: { title, description } }) => (
  <div>
    <Head>
      <title>{ title || 'Next.js Test Title' }</title>
      <meta name="description" content={description || 'Next.js Test Description'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  </div>
);

export default Meta;

Meta.propTypes = {
  props: PropTypes.shape.isRequired,
};
