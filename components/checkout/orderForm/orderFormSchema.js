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
  streetName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  streetNumber: Yup.number()
    .required('This is a required field'),
  postalCode: Yup.string()
    .min(2, 'Too Short!')
    .max(6, 'Too Long!')
    .required('This is a required field'),
  addressAddition: Yup.string(),
  city: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  phonePrefix: Yup.string()
    .min(2, 'Too Short!')
    .max(5, 'Too Long!')
    .required('This is a required field'),
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
  comment: Yup.string(),
  country: Yup.string()
    .required('This is a required field'),
});

export default OrderFormSchema;
