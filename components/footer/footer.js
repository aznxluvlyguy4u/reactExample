// components/navbar.js

import React from 'react';
import Link from 'next/link';

const Footer = () => (
  <div className="footer">
    <div className="column-wrapper">
      <div className="column">
        <h2>Site</h2>
        <ul>
          <li>
            <Link href="/"><a>Explore</a></Link>
          </li>
        </ul>
      </div>
      <div className="column">
        <h2>Legal</h2>
        <ul>
          <li>
            <Link href="/terms"><a>Terms and conditions</a></Link>
          </li>
          <li>
            <Link href="/privacy_policy"><a>Privacy Policy</a></Link>
          </li>
        </ul>
      </div>
      <div className="column">
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

    <img className="logo" alt="logo" src="/static/images/logo_dark.png" height="35" width="150" />
    <div className="copyright-wrapper">
      <span>© 2019 Ocean Premium - Water Toys anytime anywhere.</span>
    </div>
  </div>
);

export default Footer;
