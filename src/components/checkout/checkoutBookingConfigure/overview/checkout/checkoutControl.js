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

  moveToPayment(cartItem) {
    this.updateCartItem(cartItem);
    this.props.moveToPayment();
  }

  render() {
    if (this.props.cartItem) {
      return (
        <div className="checkout-control">
          {this.props.displayHeading && (
            <h2 className="flow-control">
              <a
                onClick={() => {
                  this.goToSection("logistics");
                }}
              >
                Logistics
                {this.props.cartItem.logistics && (
                  <img className="ml-2" src="/static/images/yellow-elipse-tick.png" />
                )}
              </a>
              <span className="inactive"> / </span>
              <span
                className={
                  this.state.displaySection.contactInformation ||
                  this.state.displaySection.billingInformation
                    ? "active"
                    : "inactive"
                }
              >
                <a
                  onClick={() => {
                    this.goToSection("contactInformation");
                  }}
                >
                  Contact Information
                  {this.props.cartItem.contactInformation && (
                    <img className="ml-2" src="/static/images/yellow-elipse-tick.png" />
                  )}
                </a>
              </span>
              <span className="inactive"> / </span>
              <span
                className={
                  this.state.displaySection.billingInformation
                    ? "active"
                    : "inactive"
                }
              >
                <a
                  onClick={() => {
                    this.goToSection("billingInformation");
                  }}
                >
                  Billing Information
                  {this.props.cartItem.billingInformation && (
                    <img className="ml-2" src="/static/images/yellow-elipse-tick.png" />
                  )}
                </a>
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
            <CheckoutBillingInformationForm
              cartItem={this.props.cartItem}
              updateCartItemBillingInformation={cartItem =>
                this.moveToPayment(cartItem)
              }
            />
          )}
        </div>
      );
    }
    return null;
  }
}

export default CheckoutControl;
