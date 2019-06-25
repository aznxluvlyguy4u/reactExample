import { toast } from 'react-toastify';

export function handleGeneralError() {
  toast.error('An unkown error has occurred', {
    position: toast.POSITION.TOP_RIGHT,
  });
}
