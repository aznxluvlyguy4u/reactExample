import React from 'react'
import Meta from '../components/meta'
import Navbar from '../components/navbar/navbar'
import "../assets/scss/fonts.scss";
import '../assets/scss/defaults.scss'
import ErrorLogging from '../components/errorlogging';

export default ({ children, meta }) => (
  <ErrorLogging>
    <div>
      <Meta props={meta} />
      <Navbar />
      { children }
    </div>
  </ErrorLogging>
)