import React, { useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import * as FontAwesome from 'react-icons/lib/fa';

function useWindowWidth() {
  return window.innerWidth;
}

export default class MenuContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentDidMount() {
    window.addEventListener('resize', useWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', useWindowWidth);
  }

  render() {
    const screenWidth = useWindowWidth();
    if (screenWidth < 800) {
      return (
        <div className={`mobile-menu ${this.state.open ? 'open' : ''}`}>
          <Menu
            customBurgerIcon={<FontAwesome.FaBars />}
            customCrossIcon={<FontAwesome.FaClose />}
            width={240}
            isOpen={this.state.open}
            onStateChange={({ isOpen }) => this.setState({ open: isOpen })}
            right
            disableAutoFocus
            className="nav"
          >
            {this.props.children ? this.props.children : null}
          </Menu>
        </div>
      );
    }
    return <nav className="nav"><ul>{this.props.children}</ul></nav>;
  }
}
