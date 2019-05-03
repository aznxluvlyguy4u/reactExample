import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/scss/defaults.scss';
import '../assets/scss/fonts.scss';
import '../assets/scss/icons.scss';
import PropTypes from 'prop-types';
import ErrorLogging from '../components/errorlogging';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Meta from '../components/meta';

const Default = ({
  children, meta, nav, search,
}) => (
  <ErrorLogging>
    <ToastContainer autoClose={5000} transition={Slide} position="top-right" />
    <div>
      <Meta props={meta} />
      <Header nav={nav} search={search} />
      { children }
      <Footer />
    </div>
  </ErrorLogging>
);

export default Default;

Default.propTypes = {
  children: PropTypes.element.isRequired,
  nav: PropTypes.string,
  search: PropTypes.bool,
  meta: PropTypes.shape.isRequired,
};

Default.defaultProps = { search: false, nav: 'transparent' };
