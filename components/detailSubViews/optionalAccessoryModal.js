import React, { Component } from 'react';
import { Field, Form, Formik } from 'formik';
import { isEmpty, cloneDeep } from 'lodash';
import CustomSelect from '../formComponents/select/customSelect';
import ConfigurationModal from './configurationModal';


class OptionalAccessoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: undefined, quantity: 0, modalIsOpen: false, options: [], configurations: [],
    };
    const { data } = this.props;
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    const arr = [];
    const total = parseInt(data.rates[0].quantityAvailable) + 1;
    for (let i = 0; i < total; i++) {
      arr.push({ label: `${i}x ${data.name}`, value: JSON.stringify({ id: data.id, quantity: i, name: data.name, price: data.rates[0].price }) });
    }
    this.setState({ options: arr });
  }

  // onChange(value) {
  //   const { daysInterval, data } = this.props;
  //   const json = JSON.parse(value.dropdown);
  //   this.setState({ quantity: json.quantity });
  //   console.log(daysInterval);
  //   if (daysInterval) {
  //     const price = daysInterval * (parseInt(data.rates[0].price) * parseInt(json.quantity));
  //     this.setState({ price: price.toFixed(2) });
  //   }
  // }

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

  submitConfiguration(values) {
    // this.setState({configurations: values})
  }

  render() {
    const {
      data, currentStep,
    } = this.props;
    const {
      price, quantity, modalIsOpen,
    } = this.state;
    const fullImageUrl = !isEmpty(data.images) ? data.images[0].fullImageUrl : undefined;
    return (
      <div className={'active accessories-wrapper' ? 'form active accessories-wrapper' : 'form accessories-wrapper'}>
        <div className="titlewrapper">
          {/* <h3>Optional Accessories</h3> */}
        </div>
        <div className="thumbnailImage" style={{ backgroundImage: `url(${fullImageUrl})` }} />
        <Formik
          initialValues={{
            dropdown: { label: '0x Quick Charger for Seabob F5 S', value: JSON.stringify({ id: data.id, quantity: 0, name: data.name, price: data.rates[0].price }) },
          }}
          onSubmit={this.submitConfiguration || undefined}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form>
              <div>
                <div className="form-inline">
                  <div className="edit-row accessory">
                    <div className="title-wrapper">
                      <label htmlFor="dropdown">{data.name}</label>
                      {price ? <span className="price-item">{`+ €${price}`}</span> : null}
                    </div>
                    <Field placeholder="quantity" onChange={this.props.onChange} value={this.state.options[0]} options={this.state.options} name="dropdown" setFieldValue={setFieldValue} isSearchable={false} component={CustomSelect} />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default OptionalAccessoryModal;
