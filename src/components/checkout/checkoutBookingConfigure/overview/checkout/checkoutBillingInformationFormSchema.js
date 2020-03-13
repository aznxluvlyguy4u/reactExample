import * as Yup from 'yup';

const CheckoutBillingInformationFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  surname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('This is a required field'),
  emailAddress: Yup.string()
    .email('Invalid email')
    .required('This is a required field'),
  phoneNumber: Yup.number()
    .min(2, 'Too Short!')
    .required('This is a required field'),
  company: Yup.string()
    .required('This is a required field'),
  vatNumber: Yup.string()
    .required('This is a required field'),
  streetName: Yup.string()
    .required('This is a required field'),
  streetNumber: Yup.string()
    .required('This is a required field'),
  streetNumberBlock: Yup.string(),
    //.required('This is a required field'),
  postalCode: Yup.string()
    .required('This is a required field'),
  country: Yup.string()
    .required('This is a required field'),
  securityDepositConsent: Yup.boolean()
    .oneOf([true], "Please ensure you understand the security charge desposit"),
  termsAndConditionsConsent: Yup.boolean()
    .oneOf([true], "Please accept terms and conditions"),
});

export default CheckoutBillingInformationFormSchema;
