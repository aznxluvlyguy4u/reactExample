import * as Yup from 'yup';

const searchEditValidation = Yup.object().shape({
  deliveryLocation: Yup.object().required('This is a required field'),
  collectionLocation: Yup.object().required('This is a required field'),
  collectionDate: Yup.object().required('This is a required field'),
  deliveryDate: Yup.object().required('This is a required field'),
});

export default searchEditValidation;
