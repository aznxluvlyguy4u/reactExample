import * as Yup from 'yup';

const localSearchValidation = Yup.object().shape({
  deliveryLocation: Yup.object().required('This is a required field'),
  collectionLocation: Yup.object().required('This is a required field'),
  collectionDate: Yup.string().required('This is a required field'),
  deliveryDate: Yup.string().required('This is a required field'),
});

export default localSearchValidation;
