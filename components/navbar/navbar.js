// components/navbar.js

import Link from 'next/link';
import React from 'react';
import './navbar.scss';

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      signUpModalIsOpen: false,
      nav: 'transparent'
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (this.props.nav === "fixed") {
      this.setState({nav: 'fixed'})
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  nav = React.createRef();

  handleScroll = () => {
    if (this.props.nav === "fixed") {
      return
    }

    if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
      this.setState({ nav: 'fixed' })
    } else {
      this.setState({ nav: 'transparent' })
    }
  };

  openModal() {
    this.setState({ signUpModalIsOpen: true });
  }
  closeModal() {
    this.setState({ signUpModalIsOpen: false });
  }

  render() {
    return (
      <div className={"nav-base " + this.state.nav}>
      {this.props.search ? <div className="logo-wrapper">
        <Link href='/'>
          <a><img className="logo" src={this.state.nav === 'fixed' ? "/static/images/icon_dark.png" : "/static/images/logo.png"} alt="Logo" height={this.state.nav === 'fixed' ? 23 : 25} width={this.state.nav === 'fixed' ? 31 : 120} /></a>
        </Link>
        <div className="search">test</div>
      </div> : <div className="logo-wrapper">
        <Link href='/'>
          <a><img className="logo" src={this.state.nav === 'fixed' ? "/static/images/logo_dark.png" : "/static/images/logo.png"} alt="Logo" height="25" width="120" /></a>
        </Link>
      </div>}

        <nav ref={this.nav} className='nav'>
          <ul>
            <li>
              <Link href='/'><a>Shop</a></Link>
            </li>
            <li>
              <Link href='/test'><a>Test</a></Link>
            </li>
            {/* <li>
              <button onClick={this.openModal}>Open Modal</button>
            </li> */}
          </ul>
        </nav>
        {/* <SignUp modalIsOpen={this.state.signUpModalIsOpen} openModal={this.openModal} closeModal={this.closeModal}></SignUp> */}
      </div>
    );
  }
}