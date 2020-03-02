import React, { Component } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { createClient } from "contentful";
import Loader from "../../components/loader";
import Default from "../../layouts/default";
import rootReducer from "../../reducers/rootReducer";
import * as config from "../../../config.json";

const client = createClient({
  space: config.space,
  accessToken: config.accessToken
});

class SpecialProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
    this.meta = {
      title: "Special Products | OCEAN PREMIUM - Water toys Anytime Anywhere",
      description: ""
    };
  }

  static async getInitialProps({ query }) {
    return {
      id: parseInt(query.id)
    };
  }

  async componentDidMount() {
    const entries = await client.getEntries({
      content_type: "specialPageBannerModel",
      order: "-fields.orderNumber"
    });
    this.setData(entries.items);
  }

  setData(data) {
    data.forEach(item => {
      if ((item.fields.linkUrl.sys.id = this.props.id)) {
        this.setState({ content: item.fields.linkUrl });
        console.log(item.fields.linkUrl);
      }
    });
  }

  render() {
    const content = this.state.content;
    return (
      <Default
        nav="fixed"
        search
        meta={{
          title: "Special Products Page | OCEAN PREMIUM",
          description:
            "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
        }}
      >
        {content ? (
          <div>
            <div
              className="fullWidthImage"
              style={{
                backgroundImage: `url(${content.fields.topBannerImage.fields.file.url})`
              }}
            />
            <div className="top-banner-content">
              <h2>{content.fields.topBannerTitle}</h2>
              <h5>{content.fields.topBannerSubtitle}</h5>
              <Link>
                <a className="yellow-button">
                  {content.fields.topBannerButtonText}
                </a>
              </Link>
            </div>
            <div className="container">
              <div className="mt-5 mb-5">
                <h1>{content.fields.title}</h1>
                {content.fields.mainContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="page-wrapper">
            <Loader />
          </div>
        )}
      </Default>
    );
  }
}

export default connect(rootReducer)(SpecialProducts);
