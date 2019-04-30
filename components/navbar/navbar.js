// components/navbar.js

import React from 'react'
import Link from 'next/link'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import SignUp from '../signup/signup';

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      signUpModalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({signUpModalIsOpen: true});
  }
  closeModal() {
    this.setState({signUpModalIsOpen: false});
  }

  render() {
    return (
      <div>
      <nav className='nav'>
    <ul>
      <li>
        <Link href='/'>Home</Link>
      </li>
      <li>
        <button onClick={this.openModal}>Open Modal</button>
      </li>
    </ul>
  </nav>
  <SignUp modalIsOpen={this.state.signUpModalIsOpen} openModal={this.openModal} closeModal={this.closeModal}></SignUp>
      </div>
    );
  }
}