import React, { Component } from "react";
import { connect } from "react-redux";
import Default from "../../layouts/default";
import rootReducer from "../../reducers/rootReducer";
import PhoneNumbers from "../../components/landing-pages/phonenumbers/";
import classnames from "classnames";

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Default
        nav="fixed"
        search
        meta={{
          title: "Detail Page | OCEAN PREMIUM",
          description:
            "The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts"
        }}
      >
        <div className="about-background">
          <div className="heading">
            <h1>When you need Water Toys</h1>
            <p>
              Our water toy rental service is optimised for captains, charter
              brokers and concierge services
            </p>
            <a className="yellow-button" href="tel:+31618940507">
              Give us a call
            </a>
          </div>
          <div>
            <div
              className={classnames("scroll-down-circle", {
                "display-none": !this.state.scrollDown
              })}
            >
              <img src="/static/images/Ellipse 2.png" />
            </div>
            <div
              className={classnames("scroll-down-arrow", {
                "display-none": !this.state.scrollDown
              })}
            >
              <img
                alt="scroll"
                onClick={() => this.scrollTo("general-contact")}
                src="/static/images/Vector 9.png"
              />
            </div>
          </div>
        </div>

        <div className="page-wrapper-simple">
          <div className="container about tiles">
            <div className="section">
              <div className="row align-items-center">
                <div className="col-md-8 col-lg-8 col-sm-12">
                  <h1>The leaders in water toy rentals</h1>
                  <p>
                    With charter clients today often confirming their bookings
                    last minute it can be difficult to ensure that the right
                    water tolys are available on-board. A fast response and
                    availability at short noticw are two of the qualities we
                    pride ourselves in to make your life easier.
                  </p>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12">
                  <img src="static/images/about/WaterToys.png" />
                </div>
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/WeSpecialise.png" />
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>We specialize</h1>
                <p>
                  With charter clients today often confirming their bookings
                  last minute it can be difficult to ensure that the right water
                  tolys are available on-board. A fast response and availability
                  at short noticw are two of the qualities we pride ourselves in
                  to make your life easier.
                </p>
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>Availability</h1>
                <p>
                  We operate the largest water toy rental fleet in the industry.
                  There is no bottleneck with Ocean Premium. Delivering 8
                  Seabobs, a Jetlev and a full sized Aquapark even to a remote
                  Greek island is just a phone call away.
                </p>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/Availability.png" />
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/ShortNotice.png" />
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>Short Notice</h1>
                <p>
                  In a rush to get the toys delivered on-board before guests
                  arrival? We'll give you that peace of mind and deliver on time
                  by using our own logistics resources
                </p>
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>Fast Response</h1>
                <p>
                  Getting information is important. Getting them fast, even more
                  so. So your decisions are easier to make.
                </p>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/FastResponse.png" />
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/AnytimeAnywhere.png" />
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>Delivery Anytime, Anywhere!</h1>
                <p>
                  With our own logistics network, we can deliver toys on-board
                  anywhere in Mediterranean. Deliver to a remote location?
                  <br />
                  It's easy. We've delivered toys as far as the Maldives, Bali,
                  Phuket, Carribean Islands and Seychelles.
                </p>
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>One-Way Rentals</h1>
                <p>
                  Yacht Charters rarely start and finish in the same location.
                  We can handle this. Pick-ups and drop-offs are possible
                  anywhere along your charter itinary.
                </p>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/One-Way.png" />
              </div>
            </div>

            <div className="row section align-items-center">
              <div className="col-md-4 col-lg-4 col-sm-12">
                <img src="static/images/about/NoCompromise.png" />
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12">
                <h1>No Compromise</h1>
                <p>
                  Our entire rental fleet consists of first class units, well
                  maintained and reliable. Full instructions and safety
                  briefings are provided. We guarantee you full satisfaction
                  with our service. Because we care.
                </p>
              </div>
            </div>
            <div className="section">
              <h3>We deliver all over the Carribbean</h3>
              <img
                src="static/images/about/carribbean-ports.png"
                className="img-fluid"
                alt="Map of Carribbean delivery"
              />
            </div>

            <div className="section">
              <h3>We deliver all over the Mediteranean</h3>
              <img
                src="static/images/about/mediteranean-ports.png"
                className="img-fluid"
                alt="Map of Mediteranean delivery"
              />
            </div>
          </div>
        </div>
        {/* <section className="full">
              <div className="text">
                <h1>Bookings</h1>
                <p>
                  As always please send your enquiries to Barbara in Monaco or call any of our offices 24/7.
                </p>
              </div>
            </section> */}

        {/* <div className="col-full" style={{width:'100%', display:'block', float:'left'}}>
              <h1>Bookings</h1>
              <p>
                As always please send your enquiries to Barbara in Monaco or call any of our offices 24/7.
              </p>
              <PhoneNumbers />
            </div> */}

        {/* <PhoneNumbers /> */}
      </Default>
    );
  }
}

export default connect(rootReducer)(AboutPage);
