import React from 'react';
import Meta from '../components/meta';
import Navbar from '../components/navbar/navbar';
import '../assets/scss/fonts.scss';
import '../assets/scss/defaults.scss';
import ErrorLogging from '../components/errorlogging';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default ({
  children, meta, nav, search,
}) => (
  <ErrorLogging>
    <ToastContainer autoClose={5000} transition={Slide} position="top-right" />
    <div>
      <Meta props={meta} />
      <Navbar nav={nav} search={search} />
      { children }
    </div>
  </ErrorLogging>
);
