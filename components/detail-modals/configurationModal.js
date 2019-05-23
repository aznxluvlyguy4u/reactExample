import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import {
  Field, Form, Formik, FieldArray, isEmptyChildren,
} from 'formik';
import { isEmpty } from 'lodash';
import CustomSelect from '../select';
import { transformConfigurationData } from '../../utils/data/configurationDataUtil';
import './modal.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '50%',
    minHeight: '50%',
  },
};

Modal.setAppElement('body');

class ConfigurationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: this.props.modalIsOpen,
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
  }

  // componentDidMount() {
  //   this.setState({ modalIsOpen: this.props.modalIsOpen });
  // }

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.modalIsOpen !== this.props.modalIsOpen) {
      this.setState({ modalIsOpen: this.props.modalIsOpen });
    }
    // if (nextProps.modalIsOpen !== this.props.modalIsOpen) {
    //   this.setState({ modalIsOpen: nextProps.modalIsOpen });
    // }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  handleSubmit(values) {
    console.log(values);
  }

  render() {
    const i = 0;
    const arr = new Array(this.props.quantity).fill(0);
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.props.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="configuration-modal">
          <h1>Option/Accessories Configuration</h1>
          <Formik
            initialValues={{
              items: [
                {
                  configuration: [
                    { name: 'size', value: '' },
                    { name: 'color', value: '' },
                  ],
                },
                {
                  configuration: [
                    { name: 'size', value: '' },
                    { name: 'color', value: '' },
                  ],
                },
              ],
            }}
            onSubmit={this.handleSubmit}
            render={setFieldValue => (
              <Form>
                <div className="configuration-view">
                  {arr.map((item, index) => {
                    const quantityindex = index;
                    return (
                      <div className="configuration-row">
                        <span>{`Item ${index + 1}`}</span>
                        <FieldArray
                          name="people"
                          render={helpers => (
                            <div className="input-wrapper">
                              {!isEmpty(this.props.configurations) ? (
                                this.props.configurations.map((configuration, index) => {
                                  const configindex = index;
                                  return (
                                    <div className="configuration-wrapper">
                                      <label htmlFor={`items.${quantityindex}.configuration.${configindex}.value`}>{configuration.name}</label>
                                      <Field value={transformConfigurationData(configuration.values)[0]} name={`items.${quantityindex}.configuration.${configindex}.value`} setFieldValue={setFieldValue} options={transformConfigurationData(configuration.values)} component={CustomSelect} />
                                    </div>
                                  );
                                })) : null}
                            </div>
                          )}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="button-wrapper">
                  <button className="cancel" type="button" onClick={this.props.closeModal}>Cancel</button>
                  <button className="save" type="submit">Save</button>
                </div>
              </Form>
            )}
          />
        </div>

      </Modal>
    );
  }
}

export default ConfigurationModal;
