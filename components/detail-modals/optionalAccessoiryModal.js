import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import CustomSelect from '../select';

class OptionalAccessoiryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { price: undefined };
    this.options = [
      { label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 0, id: this.props.data.id, index: this.props.index }) },
      { label: '1x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 1, id: this.props.data.id, index: this.props.index}) },
      { label: '2x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 2, id: this.props.data.id, index: this.props.index}) },
      { label: '3x Quick Charger for Seabob F5 S', value: JSON.stringify({ quantity: 3, id: this.props.data.id, index: this.props.index}) },
    ];
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    const json = JSON.parse(value.dropdown)
    if (this.props.daysInterval){
      console.log(this.props.daysInterval * (parseInt(json.quantity) * parseInt(this.props.data.rates[0].price)))
      this.setState({price: this.props.daysInterval * (parseInt(this.props.data.rates[0].price) * parseInt(json.quantity))})
    }
  }

  render() {
    return (
      <div className={this.props.active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Optional Accessories</h3>
          <h4>{this.props.index+'/'+this.props.total}</h4>
        </div>
        <div className="thumbnailImage" style={{ backgroundImage: `url(${this.props.data.images[0].fullImageUrl})` }} />
        <Formik
          initialValues={{
            dropdown: {label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({quanitity: 0, id: this.props.data.id, index: this.props.index}) },
          }}
          onSubmit={this.props.handleSubmit ? this.props.handleSubmit : undefined}
          render={setFieldValue => (
            <Form>
              <div>
                <div className="form-inline">
                  <div className="edit-row accessory">
                    <div className="title-wrapper">
                      <label htmlFor="dropdown">{this.props.data.name}</label>
                      {this.state.price ? <span>{"+ €"+this.state.price}</span> : null}
                    </div>
                    <Field placeholder="quantity" onChange={this.onChange} value={{ label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({quantity: 0, id: this.props.data.id, index: this.props.index}) }} options={this.options} name="dropdown" setFieldValue={setFieldValue} component={CustomSelect} />
                  </div>
                  <button className="search-button-full" type="submit">Next</button>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default OptionalAccessoiryModal;
