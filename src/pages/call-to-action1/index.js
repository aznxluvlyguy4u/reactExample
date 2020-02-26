import React, { Component } from "react";
import { connect } from "react-redux";
import { createClient } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import Default from "../../layouts/default";
import rootReducer from "../../reducers/rootReducer";
import * as config from "../../../config.json";

const client = createClient({
  space: config.space,
  accessToken: config.accessToken
});

class CallToAction1Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: []
    };
    this.meta = {
      title: "Special Products | OCEAN PREMIUM - Water toys Anytime Anywhere",
      description: ""
    };
  }

  async componentDidMount() {
    // Get every entries in contentful from type Article, sorted by date.
    // article is the ID of the content model we created on the dashboard.
    const entries = await client.getEntries({
      content_type: "specialPageBannerModel",
      order: "-fields.orderNumber"
    });

    // Inject in props of component
    this.setState({ allPosts: entries.items });
  }

  render() {
    const allPosts = this.state.allPosts;
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
        {/* <div
          className="fullWidthImage"
          style={{ backgroundImage: `url('https://picsum.photos/1900/400')` }}
        /> */}

        <div className="container grid-lg mt-2">
          <div className="columns">
            {allPosts &&
              allPosts.map(post => (
                <div className="container about">
                  <div className="column">
                    <div className="card" style={{ height: "100%" }}>
                      <div className="card-image">
                        <img
                          src={post.image.fields.file.url}
                          className="img-responsive img-fit-cover"
                          style={{ height: 265 }}
                        />
                      </div>
                      <div className="card-header">
                        <div className="card-title h5">{post.title}</div>
                        <div className="card-subtitle text-gray">
                          {new Date(post.date).toDateString()}
                        </div>
                      </div>
                      <div
                        className="card-body"
                        dangerouslySetInnerHTML={{
                          __html: documentToHtmlString(post.body)
                        }}
                      ></div>
                      <div className="divider"></div>
                      <div className="card-footer">
                        <div className="tile">
                          <div className="tile-content">
                            <p className="tile-title">
                              By{" "}
                              {post.author.fields.firstname +
                                " " +
                                post.author.fields.lastname}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(CallToAction1Page);
