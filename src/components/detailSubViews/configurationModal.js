import {
  Field, FieldArray, Form, Formik,
} from 'formik';
import { isEmpty } from 'lodash';
import React, { Component } from 'react';
import Modal from 'react-modal';
import { transformConfigurationData } from '../../utils/data/configurationDataUtil';
import CustomSelect from '../formComponents/select/customSelect';

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
    const { modalIsOpen } = this.props;
    this.state = {
      modalIsOpen,
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { modalIsOpen } = this.props;
    if (prevProps.modalIsOpen !== modalIsOpen) {
      this.setState({ modalIsOpen });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  transformValue(value){
    const obj = {};
    obj.value = value.value;
    obj.label = value.value;
    return obj
  }

  render() {
    const { quantity, closeModal, configurations } = this.props;
    const { modalIsOpen } = this.state;
    const arr = new Array(quantity).fill(0);
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="configuration-modal">
          <h1>Options / Preferences</h1>
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
            onSubmit={this.props.submitConfiguration}
          >
            {({
              setFieldValue,
              /* and other goodies */
            }) => (
              <Form>
                <div className="configuration-view">
                  {arr.map((item, index) => {
                    const quantityindex = index;
                    return (
                      <div className="configuration-row">
                        <FieldArray
                          name="people"
                          render={helpers => (
                            <div className="input-wrapper">
                              {!isEmpty(configurations) ? (
                                configurations.map((configuration, index) => {
                                  const configindex = index;
                                  return (
                                    <div className="configuration-wrapper">
                                      <label htmlFor={`items.${quantityindex}.configuration.${configindex}.value`}>{configuration.name}</label>
                                      <Field onChange={this.props.onChangeConfiguration} name="configuration" value={this.transformValue(this.props.configurationsstate[index])} setFieldValue={setFieldValue} options={transformConfigurationData(configuration).values} isSearchable={false} component={CustomSelect} />
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
                {/* <span>We can't guarantee that the selected options is available</span> */}
                <div className="button-wrapper">
                  <button className="cancel" type="button" onClick={closeModal}>Cancel</button>
                  <button className="save" type="submit" onClick={closeModal}>Save</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

      </Modal>
    );
  }
}

export default ConfigurationModal;
