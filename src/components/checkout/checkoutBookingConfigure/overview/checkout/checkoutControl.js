import React, { Component } from "react";
import CheckoutLogistics from "./checkoutLogistics";

class CheckoutControl extends Component {
  constructor(props) {
    super(props);

    let cartItem = props.cartItem;

    this.state = {
      cartItem,
      displaySection: {
        logistics: true,
        contactInformation: false,
        billingInformation: false
      },
    };
  }

  goToSection(section) {
    this.setState({
      displaySection: {
        logistics: section === "logistics",
        contactInformation: section === "contactInformation",
        billingInformation: section === "billingInformation"
      },
    });
  }

  updateCartItem(cartItem) {
    this.props.updateCartItem(cartItem);
  }

  render() {
    if (this.props.cartItem) {
      return (
        <div className="checkout-control">
          {this.props.displayHeading && (
            <h2>
              <a
                onClick={() => {
                  this.goToSection("logistics");
                }}
              >
                Logistics
              </a>{" "}
              <span>
                {" "}
                /{" "}
                <a
                  onClick={() => {
                    this.goToSection("contactInformation");
                  }}
                >
                  Contact Information
                </a>{" "}
                /{" "}
                <a
                  onClick={() => {
                    this.goToSection("billingInformation");
                  }}
                >
                  Billing Information
                </a>{" "}
              </span>
            </h2>
          )}
          {this.state.displaySection.logistics && (
            <CheckoutLogistics cartItem={this.props.cartItem} updateCartItemLogistics={(cartItem) => this.updateCartItem(cartItem)}/>
          )}
          {this.state.displaySection.contactInformation && <h1>contactInformation</h1>}
          {this.state.displaySection.billingInformation && <h1>billingInformation</h1>}
        </div>
      );
    }
    return null;
  }
}

export default CheckoutControl;
