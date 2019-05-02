import React, { useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import * as FontAwesome from 'react-icons/lib/fa';

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
    if (this.state.width <= 800) {
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
