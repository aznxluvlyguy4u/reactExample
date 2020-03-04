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
      id: query.id
    };
  }

  async componentDidMount() {
    const id = this.props.id;
    const entry = await client.getEntry(id);
    this.setData(entry);
  }

  setData(data) {
    this.setState({ content: data });
    console.log(data);
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
              <div id="rich-text-body" className="mt-5 mb-5">
                <div>
                  <h1 className="section-title heading">
                    {content.fields.mainContentHead1}
                  </h1>
                  <p>{content.fields.mainContentParagraph1}</p>
                  <div>
                    <div>
                      <div className="mb-3">
                        <h5 className="sub-heading">
                          {content.fields.mainContentImageTitle1}
                        </h5>
                      </div>
                      <div className="row">
                        <div className="col banner">
                          <div className="banner-container">
                            <div className="img-container">
                              <img
                                src={
                                  content.fields.mainContentImage1.fields.file
                                    .url
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="section-title heading">
                    {content.fields.mainContentHead2}
                  </h1>
                  <p>{content.fields.mainContentParagraph2}</p>
                  <div>
                    <div>
                      <div className="mb-3">
                        <h5 className="sub-heading">
                          {content.fields.mainContentImageTitle2}
                        </h5>
                      </div>
                      <div className="row">
                        <div className="col banner">
                          <div className="banner-container">
                            <div className="img-container">
                              <img
                                src={
                                  content.fields.mainContentImage2.fields.file
                                    .url
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
