import { toast } from 'react-toastify';

export function handleGeneralError(error) {
  let string = 'An unkown error has occurred';


  if (error && error.code !== '404') {
    string = error.toString();
  }

  if (error && error.code === '504') {
    string = 'An unexpected error occured, Please refresh the page in a few seconds';
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
