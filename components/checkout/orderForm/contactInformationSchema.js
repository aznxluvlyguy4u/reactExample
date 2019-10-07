import * as Yup from 'yup';

const ContactInformationFormSchema = Yup.object().shape({
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
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
  affiliation: Yup.string()
    .required('This is a required field'),
});

export default ContactInformationFormSchema;
