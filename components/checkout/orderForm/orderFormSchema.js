import * as Yup from 'yup';

const OrderFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  email: Yup.string()
    .email('Invalid email')
    .required('This is a required field'),
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
  affiliation: Yup.string()
    .required()
});

export default OrderFormSchema;
