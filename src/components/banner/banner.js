import React, { Component } from "react";
import Link from "next/link";
import slugify from "slugify";

class Banner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="bannerTitle">
          <h2 className="section-title heading">
            {this.props.data.fields.title}
          </h2>
          <span className="sub-heading">{this.props.data.fields.subtitle}</span>
        </div>
        <div className="row">
          <div className="col banner">
            <div className="banner-container">
              <p className="banner-text">{this.props.data.fields.bannerText}</p>
              <div className="img-container">
                <img src={this.props.data.fields.bannerImage.fields.file.url} />
              </div>
              <Link
                href={`/special-products?id=${
                  this.props.data.fields.linkUrl.sys.id
                }&slug=${slugify(this.props.data.fields.title)}`}
              >
                <a
                  className="yellow-button"
                  href={`/special-products?id=${
                    this.props.data.fields.linkUrl.sys.id
                  }&slug=${slugify(this.props.data.fields.title)}`}
                  as={`/special-products/${
                    this.props.data.fields.linkUrl.sys.id
                  }/${slugify(this.props.data.fields.title)}`}
                >
                  {this.props.data.fields.buttonText}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
