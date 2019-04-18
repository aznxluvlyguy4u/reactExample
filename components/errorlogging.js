import * as Sentry from '@sentry/browser';
import { Component } from 'react';

export default class ErrorLogging extends Component {
  constructor(props) {
      super(props);
      this.state = { error: null };
  }

  componentDidMount(){
    require('dotenv').config()
    Sentry.init({
      dsn: 'https://733cb82e193b4ed88b7e5aa074bbcd10@sentry.io/1441370',
    });
  }

  componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
      if (this.state.error) {
          //render fallback UI
          return (
              <div
              className="snap"
              onClick={() => Sentry.lastEventId() && Sentry.showReportDialog()}>
                  <img src={oops} />
                  <p>We're sorry — something's gone wrong.</p>
                  <p>Our team has been notified, but click here fill out a report.</p>
              </div>
          );
      } else {
          //when there's not an error, render children untouched
          return this.props.children;
      }
  }
}
