// components/navbar.js

import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import './header.scss';
import { connect } from 'react-redux';
import MenuContainer from './menuContainer/menuContainer';
import SearchInput from './searchInput/searchInput';
import cartReducer from '../../reducers/cartReducer';
import { setCartCount } from '../../actions/cartActions';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      navType: 'transparent',
      cartCount: 0,
    };

    this.menuItems = [{ id: 1, title: 'Shop', slug: 'bla' }, { id: 2, title: 'Contact', slug: 'bla' }, {
      id: 3, title: 'Cart', slug: 'checkout', icon: true,
    }];
  }

  componentWillMount() {
    const { nav } = this.props;
    if (nav === 'fixed') {
      this.setState({ navType: 'fixed' });
    }
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    if (localStorage.getItem('cart')) {
      const cart = await localStorage.getItem('cart');
      this.props.dispatch(setCartCount(JSON.parse(cart)).length);
    }
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

  render() {
    const { search, nav } = this.props;
    const { navType, cartCount } = this.state;
    console.log(this.props);
    const count = this.props.cartReducer ? this.props.cartReducer.count : 0;
    const items = this.menuItems.map((menuItem) => {
      if (menuItem.icon === true) {
        return (
          <li key={menuItem.id}>
            <Link href={`/${menuItem.slug}`}>
              <a>
                <div className="cart-wrapper">
                  <span className="cart-title">{menuItem.title}</span>
                  <div className="cart">
                    <div className="cart-icon" />
                    <span>{count}</span>
                  </div>
                </div>

              </a>

            </Link>
          </li>
        );
      }
      return (
        <li key={menuItem.id}>
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
              <a><img className="logo" alt="Logo" src={navType === 'fixed' ? '/static/images/icon_dark.png' : '/static/images/logo.png'} height={nav === 'fixed' ? 23 : 25} width={nav === 'fixed' ? 31 : 120} /></a>
            </Link>
            <SearchInput />
          </div>
        ) : (
          <div className="logo-wrapper">
            <Link href="/">
              <a><img className="logo" alt="Logo" src={navType === 'fixed' ? '/static/images/logo_dark.png' : '/static/images/logo.png'} height="25" width="120" /></a>
            </Link>
          </div>
        )}

        <MenuContainer menuItems={this.menuItems}>
          {items}
        </MenuContainer>
      </div>
    );
  }
}

Header.propTypes = {
  nav: PropTypes.string.isRequired,
  search: PropTypes.bool,
};

Header.defaultProps = { search: false };

export default connect(cartReducer)(Header);
