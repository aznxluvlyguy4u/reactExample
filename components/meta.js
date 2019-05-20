// components/meta.js

import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';

const Meta = ({ props: { title, description } }) => (
  <div>
    <Head>
      <title>{ title || 'Next.js Test Title' }</title>
      <link rel="apple-touch-icon" sizes="57x57" href="/static/images/favicon/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/static/images/favicon/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/static/images/favicon/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/static/images/favicon/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/static/images/favicon/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/static/images/favicon/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/static/images/favicon/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/static/images/favicon/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicon/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/static/images/favicon/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/static/images/favicon/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicon/favicon-16x16.png" />
      <link rel="icon" href="/static/images/favicon/favicon.ico" type="image/x-icon" />
      <meta name="description" content={description || 'Next.js Test Description'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
  </div>
);

export default Meta;

Meta.propTypes = {
  props: PropTypes.objectOf(PropTypes.any).isRequired,
};
