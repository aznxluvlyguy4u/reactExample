// components/navbar.js

import Link from 'next/link';
import React from 'react';
import './navbar.scss';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import CustomInputComponent from '../signup/customInputComponent';
import Router from 'next/router';
import * as FontAwesome from 'react-icons/lib/fa'

const initialValues = {
  keyword: ""
}

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      signUpModalIsOpen: false,
      nav: 'transparent',
      cartCount: 0
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
    if (this.props.nav === "fixed") {
      this.setState({nav: 'fixed'})
    }
  }

  componentDidMount(){
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
  onSubmit(values){
    Router.push('/search?keyword='+values.keyword)
  }
  render() {
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
            <Field name="keyword" placeholder="Anything, anytime, any place" component={CustomInputComponent}/>
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

        <nav ref={this.nav} className='nav'>
          <ul>
            <li>
              <Link href='/'><a>Shop</a></Link>
            </li>
            <li>
              <Link href='/test'><a>Test</a></Link>
            </li>
            <li>
              <Link href='/test'><a><div className="cart-wrapper"><img height="18" width="25" alt="cart" src={this.state.nav === 'fixed' ? "/static/images/cart_dark.png" : "/static/images/cart_white.png"}/> {this.state.cartCount}</div></a></Link>
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