import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ScaleLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top:50px;
`;

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="sweet-loading">
        <ScaleLoader
          css={override}
          sizeUnit="px"
          size={100}
          color="#FABA0C"
          loading={loading}
        />
      </div>
    );
  }
}
