import * as Yup from 'yup';

const searchValidation = Yup.object().shape({
  // keyword: Yup.string()
  //   .required('This is a required field'),
  deliveryLocation: Yup.string()
    .required('This is a required field')
});

export default searchValidation;
