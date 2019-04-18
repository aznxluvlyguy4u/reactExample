import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
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
  password: Yup.string()
    .min(9, 'Too Short!')
    .matches(/(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, 'Complexity requirement not met. Please use: 1 uppercase, 1 lowercase, 1 digit and 1 special character')
    .required('This is a required field'),
  confirmPassword: Yup.string()
    .required('This is a required field')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
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
  addressAddition: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!'),
  city: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  country: Yup.string()
    .required('This is a required field'),
  phonePrefix: Yup.string()
    .min(2, 'Too Short!')
    .max(5, 'Too Long!')
    .required('This is a required field'),
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
});

export default SignupSchema;