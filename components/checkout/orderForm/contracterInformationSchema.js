import * as Yup from 'yup';

const ContracterInformationFormSchema = Yup.object().shape({
  terms: Yup.bool().oneOf([true], "Agree to terms and conditions"),
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  surName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  emailAddress: Yup.string()
    .email('Invalid email')
    .required('This is a required field'),
  streetName: Yup.string()
    .required('This is a required field'),
  streetNumber: Yup.string()
    .required('This is a required field'),
  postalCode: Yup.string()
    .required('This is a required field'),
  country: Yup.string()
    .required('This is a required field'),
});

export default ContracterInformationFormSchema;
