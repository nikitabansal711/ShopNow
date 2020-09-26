import React from "react";
import Pagination from "./Pagination";
import { connect } from "react-redux";
import axios from "axios";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Grid,
  Form,
  Button,
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";

class ProductList extends React.Component {

  state = {
    loading: false,
    error: null,
    alldata: [],
    data: [],
    categories: [],
    currentPage: 1,
    setCurrentPage: 1,
    postsPerPage: 7,
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then((res) => {
        console.log(res.data);
        const unique = [...new Set(res.data.map((item) => item.category))];
        console.log(unique);
        this.setState({
          data: res.data,
          loading: false,
          categories: unique,
          alldata: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };
  handleChangeCategory = (e) => {
    let res = this.menu.value;
    if (res !== "N/A") {
      let output = this.state.alldata.filter((obj) => obj.category === res);
      this.setState({ data: output });
      console.log(output);
    } else {
      console.log("N/A");
    }
  };
  handleChangePrice = (e) => {
    let res = this.menu1.value;
    if (res !== "N/A") {
      let output = this.state.alldata.filter((obj) => obj.price <= res);
      this.setState({ data: output });
      console.log(output);
    } else {
      console.log("N/A");
    }
  };
  handleGetAll = (e) => {
    this.setState({ data: this.state.alldata });
  };
  handleSortBy = (e) => {
    let res = this.menu2.value;
    let dummy = this.state.data;
    if (res === "0") {
      dummy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      this.setState({ data: dummy });
    } else if (res === "1") {
      dummy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      this.setState({ data: dummy });
    } else {
      console.log("N/A");
    }
    console.log(dummy);
  };

  render() {
    const { data, error, loading, currentPage, postsPerPage } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => {
        this.setState({ currentPage: pageNumber });
      };
    return (
      <Container>
        {error && (
          <Message
            error
            header="uh oh! you are not logged in"
            content={JSON.stringify("Please login and try again")}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <Item.Group divided>
          <Grid textAlign="center" verticalAlign="middle">
            <Grid.Column>
              {error && (
                <Message
                  error
                  header="uh oh! seems that you are not logged in"
                  content={JSON.stringify("login and please try again")}
                />
              )}{" "}
              <React.Fragment>
                <Form size="large" onSubmit={this.handleSubmit}>
                  <Segment>
                    <div class="ui page grid">
                      <div class="seven column row">
                        <Label size="big">Category </Label>
                        &nbsp;
                        <select
                          id="dropdown"
                          ref={(input) => (this.menu = input)}
                          class="column"
                          onChange={this.handleChangeCategory}
                        >
                          <option value="N/A">N/A</option>
                          {this.state.categories.map((category) => (
                            <option value={category}>{category}</option>
                          ))}
                        </select>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Label size="big">Price </Label>
                        &nbsp;
                        <select
                          id="dropdown"
                          ref={(input) => (this.menu1 = input)}
                          class="column"
                          onChange={this.handleChangePrice}
                        >
                          <option value="N/A">N/A</option>
                          <option value="500">Rs. 0 to 500</option>
                          <option value="1000">Rs. 0 to 1000</option>
                          <option value="2500">Rs. 0 to 2500</option>
                          <option value="5000">Rs. 0 to 5000</option>
                        </select>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Label size="big">Sort By </Label>
                        &nbsp;
                        <select
                          id="dropdown"
                          ref={(input) => (this.menu2 = input)}
                          class="column"
                          onChange={this.handleSortBy}
                        >
                          <option value="N/A">N/A</option>
                          <option value="0">Low to High Price</option>
                          <option value="1">High to Low Price</option>
                        </select>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                          color="green"
                          size="small"
                          class="column"
                          onClick={this.handleGetAll}
                        >
                          Get All
                        </Button>
                      </div>
                    </div>
                  </Segment>
                </Form>
              </React.Fragment>
            </Grid.Column>
          </Grid>
          {currentPosts.map((item) => {
            return (
              <Item key={item.id} style={{height:300}} >
                <Item.Image src={item.image} style={{margin:'auto'}} />
                <Item.Content>
                  <Item.Header
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.id}`)
                    }
                  >
                    {item.title}
                  </Item.Header>
                  <Item.Meta>
                    <span className="cinema">{item.category}</span>
                  </Item.Meta>
                  <Item.Description>{item.description}</Item.Description>
                  <Item.Extra>
                    {item.discount_price && (
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )}
                  </Item.Extra>
                  <Label color="red">Rs. {item.price} Only</Label>
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={data.length}
          paginate={paginate}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ProductList);
