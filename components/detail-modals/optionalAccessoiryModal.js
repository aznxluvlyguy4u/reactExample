import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import CustomSelect from '../customSelect';
import ConfigurationModal from './configurationModal';

class OptionalAccessoiryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: undefined, quantity: 0, modalIsOpen: false, options: [],
    };
    const { data, index } = this.props;
    this.onChange = this.onChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const { data, index } = this.props;
    console.log(data.configurations)
    const arr = [];
    const total = parseInt(data.rates[0].quantityAvailable) + 1;
    for (let i = 0; i < total; i++) {
      arr.push({ label: `${i}x ${data.name}`, value: JSON.stringify({ quantity: i, data, index }) });
    }
    this.setState({ options: arr });
  }

  onChange(value) {
    const { daysInterval, data } = this.props;
    const json = JSON.parse(value.dropdown);
    this.setState({quantity: json.quantity})
    if (daysInterval) {
      const price = daysInterval * (parseInt(data.rates[0].price) * parseInt(json.quantity))
      this.setState({ price: price.toFixed(2) });
    }
  }

  toggleModal() {
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    const {
      active, index, total, data, handleSubmit,
    } = this.props;
    const {
      price, quantity, modalIsOpen,
    } = this.state;
    console.log(data.configurations)
    console.log(quantity)
    return (
      <div className={active ? 'form active' : 'form'}>
        <div className="titlewrapper">
          <h3>Optional Accessories</h3>
          <h4>{`${index}/${total}`}</h4>
        </div>
        <div className="thumbnailImage" style={{ backgroundImage: `url(${data.images[0].fullImageUrl})` }} />
        <Formik
          initialValues={{
            dropdown: { label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ quanitity: 0, data, index }) },
          }}
          onSubmit={handleSubmit || undefined}
          render={setFieldValue => (
            <Form>
              <div>
                <div className="form-inline">
                  <div className="edit-row accessory">
                    <div className="title-wrapper">
                      <label htmlFor="dropdown">{data.name}</label>
                      {price ? <span>{`+ €${price}`}</span> : null}
                    </div>
                    <Field placeholder="quantity" onChange={this.onChange} value={this.state.options[0]} options={this.state.options} name="dropdown" setFieldValue={setFieldValue} isSearchable={false} component={CustomSelect} />
                  </div>
                  {!isEmpty(data.configurations) && quantity > 0 ? <button type="button" onClick={this.toggleModal} className="configure"><i className="icon-cog" />Advanced Configuration</button> : null}
                  <button className="search-button-full" type="submit">Next</button>
                </div>
              </div>
            </Form>
          )}
        />
        <ConfigurationModal quantity={quantity} configurations={data.configurations} closeModal={this.closeModal} modalIsOpen={modalIsOpen} />
      </div>
    );
  }
}

export default OptionalAccessoiryModal;
