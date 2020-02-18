import React, { Component } from "react";
import CheckoutLogistics from "./checkoutLogistics";
import CheckoutContactInformationForm from "./checkoutContactInformationForm";
import CheckoutBillingInformationForm from "./checkoutBillingInformation";

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
      }
    };
  }

  goToSection(section) {
    this.setState({
      displaySection: {
        logistics: section === "logistics",
        contactInformation: section === "contactInformation",
        billingInformation: section === "billingInformation"
      }
    });
    this.props.checkoutState(section);
  }

  updateCartItem(cartItem) {
    this.props.updateCartItem(cartItem);
  }

  moveToContactInformation(cartItem) {
    this.updateCartItem(cartItem);
    this.goToSection("contactInformation");
  }

  moveToBillingInformation(cartItem) {
    this.updateCartItem(cartItem);
    this.goToSection("billingInformation");
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
            <CheckoutLogistics
              cartItem={this.props.cartItem}
              updateCartItemLogistics={cartItem =>
                this.moveToContactInformation(cartItem)
              }
            />
          )}
          {this.state.displaySection.contactInformation && (
            <CheckoutContactInformationForm
              cartItem={this.props.cartItem}
              updateCartItemContactInformation={cartItem =>
                this.moveToBillingInformation(cartItem)
              }
            />
          )}
          {this.state.displaySection.billingInformation && (
            <CheckoutBillingInformationForm cartItem={this.props.cartItem}/>
          )}
        </div>
      );
    }
    return null;
  }
}

export default CheckoutControl;
