import * as Yup from 'yup';

const CheckoutPayFormSchema = Yup.object().shape({
  paymentMethod: Yup.string()
    .nullable(),
});

export default CheckoutPayFormSchema;