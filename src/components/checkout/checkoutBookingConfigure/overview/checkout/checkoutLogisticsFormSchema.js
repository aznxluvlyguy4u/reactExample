import * as Yup from "yup";

const CheckoutLogisticsFormSchema = Yup.object().shape({
  pickUp: Yup.object().shape({
    streetName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    streetNumber: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    suffix: Yup.string()
      .min(1, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    postalCode: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    country: Yup.string().required("This is a required field")
  }),
  dropOff: Yup.object().shape({
    streetName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    streetNumber: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    suffix: Yup.string()
      .min(1, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    postalCode: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("This is a required field"),
    country: Yup.string().required("This is a required field")
  }),
});

export default CheckoutLogisticsFormSchema;
