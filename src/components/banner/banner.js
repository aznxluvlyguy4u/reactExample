import Link from "next/link";
import React, { Component } from "react";

class Banner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="mb-3">
          <h2 className="section-title heading">{this.props.title}</h2>
          <span className="sub-heading">
          {this.props.subTitle}
          </span>
        </div>
        <div className="row">
          <div className="col banner">
            <div className="banner-container">
              <p className="banner-text">
              {this.props.bannerText}
              </p>
              <div className="img-container">
                <img src={this.props.bannerImg} />
              </div>
              <Link href="/call-to-action1">
                <a className="yellow-button">Learn More</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;