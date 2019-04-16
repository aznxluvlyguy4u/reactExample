import React from 'react'
import Meta from '../components/meta'
import Navbar from '../components/navbar/navbar'
import "../assets/scss/fonts.scss";
import '../assets/scss/defaults.scss'

export default ({ children, meta }) => (
  <div>
    <Meta props={meta} />
    <Navbar />
    { children }
  </div>
)