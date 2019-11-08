// components/navbar.js

import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <div className="container footer">
    <div className="row">
      <div className="col-md-4">
        <h2>Site</h2>
        <ul>
          <li>
            <Link href="/"><a>Explore</a></Link>
          </li>
        </ul>
      </div>
      <div className="col-md-4">
        <h2>Legal</h2>
        <ul>
          <li>
            <Link target="_blank" href="https://www.oceanpremium.com/general-terms-conditions/"><a>Terms and conditions</a></Link>
          </li>
          <li>
            <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
          </li>
        </ul>
      </div>
      <div className="col-md-4">
        <h2>Help</h2>
        <ul>
          <li>
            <Link href="/about"><a>About</a></Link>
          </li>
          <li>
            <Link href="/contact"><a>Contact</a></Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="row">
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
