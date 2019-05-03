// components/navbar.js

import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import './header.scss';
import MenuContainer from './menuContainer/menuContainer';
import SearchInput from './searchInput/searchInput';

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      // signUpModalIsOpen: false,
      navType: 'transparent',
      cartCount: 0,
    };

    // this.openModal = this.openModal.bind(this);
    // this.closeModal = this.closeModal.bind(this);
    this.menuItems = [{ title: 'Bla', slug: 'bla' }, { title: 'Bla', slug: 'bla' }, { title: 'Cart', slug: 'cart', icon: true }];
  }

  componentWillMount() {
    const { nav } = this.props;
    if (nav === 'fixed') {
      this.setState({ navType: 'fixed' });
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { nav } = this.props;
    if (nav === 'fixed') {
      return;
    }

    if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
      this.setState({ navType: 'fixed' });
    } else {
      this.setState({ navType: 'transparent' });
    }
  };

  // openModal() {
  //   this.setState({ signUpModalIsOpen: true });
  // }

  // closeModal() {
  //   this.setState({ signUpModalIsOpen: false });
  // }

  render() {
    const { search, nav } = this.props;
    const { navType, cartCount } = this.state;
    const items = this.menuItems.map((menuItem) => {
      if (menuItem.icon === true) {
        return (
          <li>
            <Link href={`/${menuItem.slug}`}>
              <a>
                <div className="cart-wrapper">
                  <span className="cart-title">{menuItem.title}</span>
                  <div className="cart">
                    <div className="cart-icon" />
                    <span>{cartCount}</span>
                  </div>
                </div>

              </a>

            </Link>
          </li>
        );
      }
      return (
        <li>
          <Link key={menuItem.title} href={`/${menuItem.slug}`}>
            <a>{menuItem.title}</a>
          </Link>
        </li>
      );
    });
    return (
      <div className={`header ${navType}`}>
        {search ? (
          <div className="logo-wrapper">
            <Link href="/">
              <a><img className="logo" src={navType === 'fixed' ? '/static/images/icon_dark.png' : '/static/images/logo.png'} alt="Logo" height={nav === 'fixed' ? 23 : 25} width={nav === 'fixed' ? 31 : 120} /></a>
            </Link>
            <SearchInput />
          </div>
        ) : (
          <div className="logo-wrapper">
            <Link href="/">
              <a><img className="logo" src={navType === 'fixed' ? '/static/images/logo_dark.png' : '/static/images/logo.png'} alt="Logo" height="25" width="120" /></a>
            </Link>
          </div>
        )}

        <MenuContainer menuItems={this.menuItems}>
          {items}
          {/* <li>
              <button onClick={this.openModal}>Open Modal</button>
            </li> */}
        </MenuContainer>
        {/* <button onClick={this.showSettings} className="burger-menu" type="submit">
        <FontAwesome.FaBars /></button> */}
        {/* <SignUp modalIsOpen={this.state.signUpModalIsOpen} openModal={this.openModal}
        closeModal={this.closeModal}></SignUp> */}
      </div>
    );
  }
}

Header.propTypes = {
  nav: PropTypes.string.isRequired,
  search: PropTypes.bool,
};

Header.defaultProps = { search: false };
