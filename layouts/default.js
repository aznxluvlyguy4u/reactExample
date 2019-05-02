import React from 'react';
import Meta from '../components/meta';
import '../assets/scss/fonts.scss';
import '../assets/scss/defaults.scss';
import ErrorLogging from '../components/errorlogging';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

export default ({
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
