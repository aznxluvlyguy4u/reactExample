import { toast } from 'react-toastify';

export function handleGeneralError(error) {
  let string = 'An unkown error has occurred';

  if (error && error.code !== '404') {
    console.log('Handled error = ', error);
    string = error.toString();
  }
  toast.error(string, {
    position: toast.POSITION.TOP_RIGHT,
  });
}
