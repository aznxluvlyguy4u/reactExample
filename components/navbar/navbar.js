// components/navbar.js

import Link from 'next/link';
import React from 'react';
import './navbar.scss';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import CustomInputComponent from '../signup/customInputComponent';
import Router from 'next/router';
import * as FontAwesome from 'react-icons/lib/fa'
import { slide as Menu } from 'react-burger-menu';
import MenuContainer from './menuContainer';

const initialValues = {
  keyword: ""
}

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      signUpModalIsOpen: false,
      nav: 'transparent',
      cartCount: 0,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.menuItems = [{ title: 'bla' }, { title: 'bla' }, { title: 'cart', icon: true }]
  }

  componentWillMount() {
    if (this.props.nav === "fixed") {
      this.setState({ nav: 'fixed' })
    }
  }

  componentDidMount() {
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
  onSubmit(values) {
    Router.push('/search?keyword=' + values.keyword)
  }
  showSettings(event) {
    event.preventDefault();
  }
  render() {
    const items = this.menuItems.map(menuItem => {
      if (menuItem.icon === true) {
        return (
          <li>
            <Link href='/test'><a><div className="cart-wrapper"><div className="cart"></div><span>{this.state.cartCount}</span></div></a></Link>
          </li>
        )
      }
      return (
        <li>
          <Link key={menuItem.title} href={'/'+menuItem.title}>
            <a>{menuItem.title}</a>
          </Link>
        </li>
      )
    })
    return (
      <div className={"nav-base " + this.state.nav}>
        {this.props.search ? <div className="logo-wrapper">
          <Link href='/'>
            <a><img className="logo" src={this.state.nav === 'fixed' ? "/static/images/icon_dark.png" : "/static/images/logo.png"} alt="Logo" height={this.props.nav === 'fixed' ? 23 : 25} width={this.props.nav === 'fixed' ? 31 : 120} /></a>
          </Link>
          <Formik
            initialValues={initialValues}
            onSubmit={this.onSubmit}
            render={({ errors, touched, validateForm, setFieldValue }) => (
              <Form>
                <div className="search-wrapper">
                  <div className="search form-block">
                    <Field name="keyword" placeholder="Anything, anytime, any place" component={CustomInputComponent} />
                  </div>
                  <button className="search-button" type="submit"><FontAwesome.FaSearch /></button>
                </div>
              </Form>
            )}
          />
        </div> : <div className="logo-wrapper">
            <Link href='/'>
              <a><img className="logo" src={this.state.nav === 'fixed' ? "/static/images/logo_dark.png" : "/static/images/logo.png"} alt="Logo" height="25" width="120" /></a>
            </Link>
          </div>}

        <MenuContainer menuItems={this.menuItems}>
         {items}
          {/* <li>
              <button onClick={this.openModal}>Open Modal</button>
            </li> */}
        </MenuContainer>
        {/* <button onClick={this.showSettings} className="burger-menu" type="submit"><FontAwesome.FaBars /></button> */}
        {/* <SignUp modalIsOpen={this.state.signUpModalIsOpen} openModal={this.openModal} closeModal={this.closeModal}></SignUp> */}
      </div>
    );
  }
}