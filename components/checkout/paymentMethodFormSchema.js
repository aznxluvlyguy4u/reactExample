import * as Yup from 'yup';

const PaymentMethodFormSchema = Yup.object().shape({
  paymentMethod: Yup.string()
    .required('This is a required field'),
});

export default PaymentMethodFormSchema;
