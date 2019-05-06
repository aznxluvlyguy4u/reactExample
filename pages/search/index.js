import React, { Component } from 'react';
import Default from '../../layouts/default';
import '../index/index.scss';
import { connect } from 'react-redux';
import { updateSearch } from '../../actions/searchActions';
import searchReducer from '../../reducers/searchReducer';
// import { getProducts } from '../../utils/rest/requests/products';

const meta = { title: 'Oceanpremium - Test', description: 'Index description' };

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }


  static async getInitialProps({ query }) {
    return { keyword: query.keyword };
  }

  componentDidMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
    // try {
    //   getProducts();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    console.log(this.props);
    return (<Default nav="fixed" search meta={meta} />);
  }
}

export default connect(searchReducer)(SearchPage);
