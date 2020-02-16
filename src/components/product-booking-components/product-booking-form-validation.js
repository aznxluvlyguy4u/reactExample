import * as Yup from "yup";

const productBookingFormValidation = Yup.object().shape({
  bookingItem: Yup.string().required("This is a required field"),
  deliveryLocation: Yup.string().required("This is a required field"),
  collectionLocation: Yup.string().required("This is a required field"),
  collectionDate: Yup.string().required("This is a required field"),
  deliveryDate: Yup.string().required("This is a required field"),
});

export default productBookingFormValidation;
