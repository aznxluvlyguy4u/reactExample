import * as Yup from 'yup';

const CheckoutPayFormSchema = Yup.object().shape({
  paymentMethod: Yup.string()
    .required('This is a required field'),
});

export default CheckoutPayFormSchema;