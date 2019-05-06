import React, { Component } from 'react';
import Default from '../../layouts/default';
import '../index/index.scss';
import { connect } from 'react-redux';
import { updateSearch } from '../../actions/searchActions';
import searchReducer from '../../reducers/searchReducer';
import { getProducts } from '../../utils/rest/requests/products';
import './search.scss';

const meta = { title: 'Oceanpremium - Test', description: 'Index description' };

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }

  static async getInitialProps({ query }) {
    return { keyword: query.keyword };
  }

  async componentDidMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
    try {
      const response = await getProducts(keyword);
      this.setState({ products: response.data.products });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Default nav="fixed" search meta={meta}>
        <div className="page-wrapper">
          <h1>Search Results</h1>

        </div>
      </Default>
    );
  }
}

export default connect(searchReducer)(SearchPage);
