import React, { Component } from 'react';
import { connect } from 'react-redux';
import Default from '../../layouts/default';
import rootReducer from '../../reducers/rootReducer';
import PhoneNumbers from '../../components/landing-pages/phonenumbers/';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {

    return (
      <Default nav="fixed" search meta={{ title: 'Detail Page | OCEAN PREMIUM', description: 'The Leaders in Water Toys Rentals - Water Toys Sales for Megayachts' }}>
        <div className="page-wrapper">
          <div className="fullWidthImage" style={{ backgroundImage: `url('static/images/about.png')` }} />
          <div className="about-wrapper">
            <h1>About</h1>
            <section className="left">
              <div className="text">
                <h2>The leaders in water toy rentals</h2>
                <p>
                  With charter clients today often confirming their bookings last minute it can be difficult to ensure that the right water tolys are available on-board. A fast response and availability at short noticw are two of the qualities we pride ourselves in to make your life easier.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/WaterToys.png" />
              </div>
            </section>

            <section className="right">
              <div className="text">
                <h2>We specialize</h2>
                <p>
                  With charter clients today often confirming their bookings last minute it can be difficult to ensure that the right water tolys are available on-board. A fast response and availability at short noticw are two of the qualities we pride ourselves in to make your life easier.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/WeSpecialise.png" />
              </div>
            </section>

            <section className="left">
              <div className="text">
                <h2>Availability</h2>
                <p>
                  We operate the largest water toy rental fleet in the industry. There is no bottleneck with Ocean Premium. Delivering 8 Seabobs, a Jetlev and a full sized Aquapark even to a remote Greek island is just a phone call away.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/Availability.png" />
              </div>
            </section>

            <section className="right">
              <div className="text">
                <h2>Short Notice</h2>
                <p>
                  In a rush to get the toys delivered on-board before guests arrival? We'll give you that peace of mind and deliver on time by using our own logistics resources
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/ShortNotice.png" />
              </div>
            </section>

            <section className="left">
              <div className="text">
                <h2>Fast Response</h2>
                <p>
                  Getting information is important. Getting them fast, even more so. So your decisions are easier to make.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/FastResponse.png" />
              </div>
            </section>

            <section className="right">
              <div className="text">
                <h2>Delivery Anytime, Anywhere!</h2>
                <p>
                  With our own logistics network, we can deliver toys on-board anywhere in Mediterranean. Deliver to a remote location?
                  <br />
                  It's easy. We've delivered toys as far as the Maldives, Bali, Phuket, Carribean Islands and Seychelles.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/AnytimeAnywhere.png" />
              </div>
            </section>

            <section className="left">
              <div className="text">
                <h2>One-Way Rentals</h2>
                <p>
                  Yacht Charters rarely start and finish in the same location. We can handle this. Pick-ups and drop-offs are possible anywhere along your charter itinary.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/One-Way.png" />
              </div>
            </section>

            <section className="right">
              <div className="text">
                <h2>No Compromise</h2>
                <p>
                  Our entire rental fleet consists of first class units, well maintained and reliable. Full instructions and safety briefings are provided. We guarantee you full satisfaction with our service. Because we care.
                </p>
              </div>
              <div className="image">
                <img src="static/images/about/NoCompromise.png" />
              </div>
            </section>


            {/* <section className="full">
              <div className="text">
                <h2>Bookings</h2>
                <p>
                  As always please send your enquiries to Barbara in Monaco or call any of our offices 24/7.
                </p>
              </div>
            </section> */}

            {/* <div className="col-full" style={{width:'100%', display:'block', float:'left'}}>
              <h2>Bookings</h2>
              <p>
                As always please send your enquiries to Barbara in Monaco or call any of our offices 24/7.
              </p>
              <PhoneNumbers />
            </div> */}

            {/* <PhoneNumbers /> */}

          </div>
        </div>
      </Default>
    );
  }
}

export default connect(rootReducer)(AboutPage);
