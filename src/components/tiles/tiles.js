import React, { Component } from "react";
import slugify from "slugify";

class Tiles extends Component {
  constructor(props) {
    super(props);
  }

  toUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div>
        {this.props.category.productGroups &&
          this.props.category.productGroups.length > 0 && (
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="section-title heading tilesHeading">
                      {this.toUpperCase(this.props.category.name)}
                    </h2>
                    {this.props.subHeading ? (
                      <span className="sub-heading">
                        Search through hundreds of Water Toys and add them to
                        your trip!
                      </span>
                    ) : (
                      <div style={{ borderTop: "2px solid #D3D3D3" }}></div>
                    )}
                  </div>
                </div>
                <div className="row products">
                  <div className="col-md-12">
                    <div className="row">
                      {this.props.category.productGroups.map((item, index) => {
                        return (
                          <div
                            key={item.name + index}
                            className="col-lg-3 col-md-4 col-sm-6 py-0 my-0"
                          >
                            <a
                              href={`/product-group?id=${
                                item.id
                              }&slug=${slugify(item.name)}`}
                              as={`/product-group/${item.id}/${slugify(
                                item.name
                              )}`}
                            >
                              <div className="product">
                                <img
                                  alt={item.name}
                                  src={
                                    item.imageThumbnail
                                      ? item.imageThumbnail.url
                                      : "/static/images/flyboard.png"
                                  }
                                />
                                <h4>{item.name}</h4>
                              </div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                    {this.props.showAll && <div className="row showmore-wrapper">
                      <div className="col">
                        <a
                          href={`/category?id=${this.props.category.id}`}
                          className="showmore"
                        >
                          Show all &gt;
                        </a>
                      </div>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default Tiles;
