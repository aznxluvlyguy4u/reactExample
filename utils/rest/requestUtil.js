import * as Sentry from '@sentry/browser';

function createErrorLogNotification(restError) {
  if (
    restError.status === 401
  ) {
    return;
  }

  const status = `(${restError.status})`;
  const message = `Message: ${restError.message}`;
  const path = `Path: ${restError.path}`;
  const fullErrorMessage = `${status} ${message}, ${path}`;

  Sentry.captureException(fullErrorMessage, {
    tags: { type: 'handleRestResponse' },
    extra: { restError },
  });
}


export default function handleRestResponse(response) {

  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.json());
  }

  if (response.status >= 400 && response.status < 500) {
    // alert('error 400 range');
  }

  if (response.status === 500) {
    // alert('error 500 range');
  }

  // 429 komt oorspronkelijk van currentrms

  // 500 vanuit API wrapped + error.
  // 500 die niet overeen komt met de
  // // Als message op 500 dan tonen anders is het een AWS error en daar kunnen we verder weinig mee

  // if (response.status >= 429 && response.status < 300) {
  //   return Promise.resolve(response.json());
  // }



  return Promise.resolve(response.json())
    .catch(err => ({ status: response.status, message: response.message }))
    .then((restError) => {

      if (restError.status >= 400 && restError.status < 500) {
        // if error has message
        // loop through array
      }

      if (restError.status == 500) {
        // show message
        // if error has message
        // loop through array
      }

      // createErrorLogNotification(restError);
      throw (restError);
    });
}
