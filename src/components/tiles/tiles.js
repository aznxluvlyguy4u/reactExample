import React, { Component } from "react";
import Link from "next/link";
import slugify from "slugify";
import { getByGroupId } from "../../utils/rest/requests/products";

class Tiles extends Component {
  constructor(props) {
    super(props);
    const from = [];
    props.category.productGroups.map(element => {
      return getByGroupId(element.id)
        .then(response => {
          let minimum = 0;
          response.data.map(data => {
            if (data.rates && data.rates.length > 0) {
              if (minimum === 0 || data.rates[0].price < minimum) {
                minimum = data.rates[0].price;
              }
            }
            return;
          });
          from.push({ id: element.id, minimum });
        })
        .catch(err => console.log(err));
    });

    this.state = {
      from
    };
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
                    <h2 className="section-title heading">
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
                          <div className="col-lg-3 col-md-4 col-sm-6">
                            <Link>
                              <a
                                key={index}
                                // href={`/detail?id=${item.id}&slug=${slugify(
                                //   item.name
                                // )}`}
                                // as={`/detail/${item.id}/${slugify(item.name)}`}
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
                                  {this.state.from &&
                                    this.state.from.find(
                                      from => from.id === item.id
                                    ) && (
                                      <span
                                        className={
                                          this.state.from.find(
                                            from => from.id === item.id
                                          ).minimum === 0
                                            ? "d-none"
                                            : ""
                                        }
                                      >
                                        from €
                                        {
                                          this.state.from.find(
                                            from => from.id === item.id
                                          ).minimum
                                        }
                                      </span>
                                    )}
                                </div>
                              </a>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    <div className="row">
                      <div className="col">
                        <a
                          href={`/search?category=${this.props.category.id}`}
                          className="showmore"
                        >
                          Show More &gt;
                        </a>
                      </div>
                    </div>
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
