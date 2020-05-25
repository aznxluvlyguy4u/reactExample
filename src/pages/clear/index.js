import React, { Component } from "react";
import { withRouter } from 'next/router'
import localStorageUtil from "../../utils/localStorageUtil";
import { connect } from "formik";

class ClearPage extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
        try {
            localStorageUtil.emptyCart();
            this.props.router.push("/");
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return <div>Loading...</div>
    }
}

export default connect(withRouter(ClearPage));