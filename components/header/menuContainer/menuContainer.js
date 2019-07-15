import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import PropTypes from 'prop-types';

export default class MenuContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, width: undefined };
    this.useWindowWidth = this.useWindowWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.useWindowWidth);
    this.useWindowWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.useWindowWidth);
  }

  useWindowWidth() {
    this.setState({ width: window.innerWidth });
    return window.innerWidth;
  }

  render() {
    const { width, open } = this.state;
    const { children } = this.props;
    if (width <= 800) {
      return (
        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          <Menu
            customBurgerIcon={<i className="icon-menu" />}
            customCrossIcon={<i className="icon-x" />}
            width={240}
            isOpen={open}
            onStateChange={({ isOpen }) => this.setState({ open: isOpen })}
            right
            disableAutoFocus
            className="nav"
          >
            <img className="logo" alt="logo" src="/static/images/logo_dark.png" height="25" width="120" />
            {children || null}
          </Menu>
        </div>
      );
    }
    return <nav className="nav"><ul>{children}</ul></nav>;
  }
}

MenuContainer.propTypes = {
  children: PropTypes.array.isRequired,
};
