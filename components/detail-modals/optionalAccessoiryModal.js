import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import CustomSelect from '../select';
import ConfigurationModal from './configurationModal';

class OptionalAccessoiryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: undefined, quantity: 0, modalIsOpen: false, options: [],
    };
    this.options = [
      { label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 0, data: this.props.data, index: this.props.index }) },
      { label: '1x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 1, data: this.props.data, index: this.props.index }) },
      { label: '2x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 2, data: this.props.data, index: this.props.index }) },
      { label: '3x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 3, data: this.props.data, index: this.props.index }) },
    ];
    this.onChange = this.onChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const arr = [];
    const total = parseInt(this.props.data.rates[0].quantityAvailable) + 1;
    for (let i = 0; i < total; i++) {
      arr.push({ label: `${i}x ${this.props.data.name}`, value: JSON.stringify({ quantity: i, data: this.props.data, index: this.props.index }) });
    }
    this.setState({ options: arr });
  }

  onChange(value) {
    const json = JSON.parse(value.dropdown);
    if (this.props.daysInterval) {
      console.log(this.props.daysInterval * (parseInt(json.quantity) * parseInt(this.props.data.rates[0].price)));
      this.setState({ quantity: parseInt(json.quantity), price: this.props.daysInterval * (parseInt(this.props.data.rates[0].price) * parseInt(json.quantity)) });
    }
  }

  toggleModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    console.log('close');
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    return (
      <div className={this.props.active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Optional Accessories</h3>
          <h4>{`${this.props.index}/${this.props.total}`}</h4>
        </div>
        <div className="thumbnailImage" style={{ backgroundImage: `url(${this.props.data.images[0].fullImageUrl})` }} />
        <Formik
          initialValues={{
            dropdown: { label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ quanitity: 0, data: this.props.data, index: this.props.index }) },
          }}
          onSubmit={this.props.handleSubmit ? this.props.handleSubmit : undefined}
          render={setFieldValue => (
            <Form>
              <div>
                <div className="form-inline">
                  <div className="edit-row accessory">
                    <div className="title-wrapper">
                      <label htmlFor="dropdown">{this.props.data.name}</label>
                      {this.state.price ? <span>{`+ €${this.state.price}`}</span> : null}
                    </div>
                    <Field placeholder="quantity" onChange={this.onChange} value={{ label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 0, data: this.props.data, index: this.props.index }) }} options={this.state.options} name="dropdown" setFieldValue={setFieldValue} component={CustomSelect} />
                  </div>
                  {!isEmpty(this.props.data.configurations) && this.state.quantity > 0 ? <button type="button" onClick={this.toggleModal} className="configure">Advanced Configuration</button> : null}
                  <button className="search-button-full" type="submit">Next</button>
                </div>
              </div>
            </Form>
          )}
        />
        <ConfigurationModal quantity={this.state.quantity} configurations={this.props.data.configurations} closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} />
      </div>
    );
  }
}

export default OptionalAccessoiryModal;
