// components/navbar.js

import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <div className="container footer">
    <div className="row">
      <div className="col-lg-2 col-md-2 col-sm-6">
        <h2>Site</h2>
        <ul>
          <li>
            <Link href="/"><a href="/">Explore</a></Link>
          </li>
          <li>
            <Link href="//www.oceanpremium.com/shop/"><a href="//www.oceanpremium.com/shop/">Shop</a></Link>
          </li>
        </ul>
      </div>
      <div className="col-lg-2 col-md-2 col-sm-6">
        <h2>Help</h2>
        <ul>
          <li>
            <Link href="/about"><a href="/about">About</a></Link>
          </li>
          <li>
            <Link href="/contact"><a href="/contact">Contact</a></Link>
          </li>
        </ul>
      </div>
      <div className="col-lg-2 col-md-2 col-sm-6">
        <h2>Legal</h2>
        <ul>
          <li>
            <a target="_blank" href="//www.oceanpremium.com/general-terms-conditions/">Terms and conditions</a>
          </li>
          <li>
            <Link href="/privacy-policy"><a href="/privacy-policy">Privacy Policy</a></Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="row logo-line">
      <div className="col">
        <img className="logo" alt="logo" src="/static/images/logo_dark.png" height="35" width="150" />
      </div>
    </div>
    <div className="row">
      <div className="col text-center">
        <div className="copyright-wrapper">
          <span>© 2019 Ocean Premium - Water Toys anytime anywhere.</span>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
