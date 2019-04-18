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
  return Promise.resolve(response.json())
    .catch(err => ({ status: response.status, message: response.message }))
    .then((restError) => {
      console.log(restError);
      // createErrorLogNotification(restError);
      throw (restError);
    });
}
