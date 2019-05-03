import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './menuContainer.scss';
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
    if (this.state.width <= 800) {
      return (
        <div className={`mobile-menu ${this.state.open ? 'open' : ''}`}>
          <Menu
            customBurgerIcon={<i className="icon-menu" />}
            customCrossIcon={<i className="icon-x" />}
            width={240}
            isOpen={this.state.open}
            onStateChange={({ isOpen }) => this.setState({ open: isOpen })}
            right
            disableAutoFocus
            className="nav"
          >
            <img className="logo" alt="logo" src="/static/images/logo_dark.png" height="25" width="120" />
            {this.props.children ? this.props.children : null}
          </Menu>
        </div>
      );
    }
    return <nav className="nav"><ul>{this.props.children}</ul></nav>;
  }
}

MenuContainer.propTypes = {
  children: PropTypes.element.isRequired,
};
