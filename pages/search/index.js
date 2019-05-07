import React, { Component } from 'react';
import Default from '../../layouts/default';
import '../index/index.scss';
import { connect } from 'react-redux';
import { updateSearch } from '../../actions/searchActions';
import searchReducer from '../../reducers/searchReducer';
import { getProducts } from '../../utils/rest/requests/products';
import ReactPaginate from 'react-paginate';
import './search.scss';
import Loader from '../../components/loader';

const meta = { title: 'Oceanpremium - Search', description: 'Index description' };

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], total_page_count: 0, current_page: 0, loading: false,
    };
  }

  static async getInitialProps({ query }) {
    return { keyword: query.keyword };
  }

  componentWillMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
  }

  async componentDidMount() {
    const { keyword, dispatch } = this.props;
    dispatch(updateSearch({ keyword }));
    await this.getProducts(keyword);
  }

  async componentDidUpdate() {
    const { keyword, dispatch } = this.props;

    if (this.props.keyword !== await this.props.searchReducer.search.keyword) {
      this.setState({ products: [] });
      dispatch(updateSearch({ keyword }));
      await this.getProducts(keyword);
    }
  }

  async getProducts() {
    const { keyword, dispatch } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getProducts(keyword);
      this.setState({
        loading: false, products: response.data.products, total_page_count: response.data.meta.total_row_count / response.data.meta.per_page, current_page: response.data.page,
      });
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const { products, loading } = this.state;
    return (
      <Default nav="fixed" search meta={meta}>
        <div className="page-wrapper">
          <h1>Search Results</h1>
          <div className="search-block">
            <div className="result-wrapper">
              <div className="searchresult-title">
                <h3>Matching Water Toys</h3>
                <span>Search through hundreds of Water Toys and add them to your trip!</span>
              </div>

              {loading ? <Loader /> : null}
              {products.map(item => (
                <div className="result-item">
                  <img src={item.custom_fields.public_icon_thumb_url ? item.custom_fields.public_icon_thumb_url : '/static/images/flyboard.png'} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </Default>
    );
  }
}

export default connect(searchReducer)(SearchPage);
