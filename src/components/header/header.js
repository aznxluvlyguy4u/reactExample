import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MenuContainer from './menuContainer/menuContainer';
import SearchInput from './searchInput/searchInput';
import { cartReducer } from '../../reducers/cartReducer';
import { addToCart } from '../../actions/cartActions';

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      navType: 'transparent',
    };

    this.menuItems = [
      { id: 1, title: 'Rentals',  isExternal: false, slug: '' },
      { id: 2, title: 'Shop',  isExternal: true, slug: '//shop.oceanpremium.com' },
      { id: 3, title: 'News',  isExternal: true, slug: '//shop.oceanpremium.com/blog' },
      { id: 4, title: 'About',  isExternal: true, slug: '//shop.oceanpremium.com/about' },
      { id: 5, title: 'Contact',  isExternal: true, slug: '//shop.oceanpremium.com/contact' },
      { id: 6, title: 'Cart',  isExternal: false, slug: 'checkout', icon: true,
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
    const { navType } = this.state;
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
                    <span>{this.props.cartReducer.items.length ? this.props.cartReducer.items.length : 0}</span>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        );
      }
      return (
        <li key={menuItem.id}>
           {menuItem.isExternal ?
              <a class="header-menu-item" target="_blank" href={`${menuItem.slug}`}> {menuItem.title}</a>
            :
              <Link
                key={menuItem.title}
                href={`/${menuItem.slug}`}>
                <a class="header-menu-item">{menuItem.title}</a>
              </Link>
            }
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
              <a><img className="logo" alt="Logo" src={navType === 'fixed' ? '/static/images/logo_dark.png' : '/static/images/logo.png'} height="35" width="192" /></a>
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

const mapStateToProps = ({ localSearchReducer, cartReducer }) => {
  return {
    localSearchReducer,
    cartReducer
  };
};

export default connect(
  mapStateToProps, {
    addToCart
   }
)(Header);
