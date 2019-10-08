import { toast } from 'react-toastify';

export function handleGeneralError(error) {
  let string = 'An unkown error has occurred';

  if (error && error.code !== '404') {
    string = error.toString();
  }
  toast.error(string, {
    position: toast.POSITION.TOP_RIGHT,
  });
}


export function handlePaymentError(error) {
  let string = error.message;

  toast.error(string, {
    position: toast.POSITION.TOP_RIGHT,
  });
}
