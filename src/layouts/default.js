import PropTypes from 'prop-types';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import ErrorLogging from '../components/errorlogging';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Meta from '../components/meta';

const Default = ({
  children, meta, nav, search,
}) => (
  <ErrorLogging>
    <ToastContainer autoClose={5000} transition={Slide} position="top-right" />
    <Meta props={meta} />
    <Header nav={nav} search={search} />
    { children }
    <div className="line"></div>
    <Footer />
  </ErrorLogging>
);

export default Default;

Default.propTypes = {
  children: PropTypes.array.isRequired,
  nav: PropTypes.string,
  search: PropTypes.bool,
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
};

Default.defaultProps = { search: false, nav: 'transparent' };
