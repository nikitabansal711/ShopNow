import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Message,
  Segment,
  Select,
  Divider,
} from "semantic-ui-react";
import {
  productDetailURL,
  addToCartURL,
  addWishlistURL,
  removeWishlistURL,
} from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
    shareLink: null,
  };
  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  handleChangeImage = (image) => {
    this.setState({
      itemImage: image,
    });
  };

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    const currentRoute = window.location.href;
    this.setState({ loading: true });
    axios
      .get(productDetailURL(params.productID))
      .then((res) => {
        this.setState({
          data: res.data,
          loading: false,
          shareLink: currentRoute,
        });
        this.setState({ itemImage: res.data.image });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleAddToWishlist = () => {
    const { data } = this.state;
    authAxios({
      method: "post",
      url: addWishlistURL,
      data: data.id,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        alert(res.data.status);
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleRemoveFromWishlist = () => {
    const { data } = this.state;
    authAxios({
      method: "post",
      url: removeWishlistURL,
      data: data.id,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        alert(res.data.status);
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFormatData = (formData) => {
    return Object.keys(formData).map((key) => {
      return formData[key];
    });
  };

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { slug, variations })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, formData, formVisible, loading } = this.state;
    const item = data;
    const { isAuthenticated } = this.props;
    return (
      <Container>
        {error && (
          <Message
            error
            header="uh on! you are not logged in"
            content={JSON.stringify("PLease login and try again")}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
            <Image src={require("./images/home2.jpeg")} />
          </Segment>
        )}
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                style={{ width: 555 }}
                image={
                  <React.Fragment>
                    <img
                      src={this.state.itemImage}
                      alt=""
                      style={{ maxWidth: 600, maxHeight: 700 }}
                    />
                  </React.Fragment>
                }
                header={item.title}
                meta={
                  <React.Fragment>
                    {item.category}
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
                  </React.Fragment>
                }
                description={item.description}
                extra={
                  <React.Fragment>
                    <React.Fragment>
                      <Header>Rs {item.price}</Header>
                    </React.Fragment>
                    <Divider />
                    <React.Fragment>
                      <Button
                        fluid
                        color="yellow"
                        floated="right"
                        icon
                        labelPosition="right"
                        onClick={this.handleToggleForm}
                      >
                        Add to cart
                        <Icon name="cart plus" />
                      </Button>
                      <Divider />
                    </React.Fragment>
                    <Divider />
                    {isAuthenticated ? (
                      <React.Fragment fluid>
                        <Divider />
                        <Button
                          title="Add to Wishlist"
                          icon
                          className="btn btn-primary"
                          color="purple"
                          labelPosition="right"
                          onClick={this.handleAddToWishlist}
                        >
                          Add to Wishlist
                          <Icon name="thumbs up" />
                        </Button>
                        <Button
                          title="Remove from Wishlist"
                          icon
                          className="btn btn-primary"
                          color="teal"
                          labelPosition="right"
                          onClick={this.handleRemoveFromWishlist}
                        >
                          Remove From Wishlist
                          <Icon name="thumbs down" />
                        </Button>
                        <CopyToClipboard text={this.state.shareLink}>
                          <Button
                            title="Share"
                            icon
                            floated="right"
                            className="btn btn-primary"
                            color="green"
                            labelPosition="right"
                            onClick={() =>
                              alert("Shared link copied to Clipboard.")
                            }
                          >
                            Share
                            <Icon name="share square" />
                          </Button>
                        </CopyToClipboard>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Divider />
                        <CopyToClipboard text={this.state.shareLink}>
                          <Button
                            title="Share"
                            icon
                            className="btn btn-primary"
                            color="green"
                            labelPosition="right"
                            onClick={() =>
                              alert("Shared link copied to Clipboard.")
                            }
                          >
                            Share
                            <Icon name="share square" />
                          </Button>
                        </CopyToClipboard>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                }
              />
              {formVisible && (
                <React.Fragment>
                  <Divider />
                  <Form onSubmit={() => this.handleAddToCart(item.slug)}>
                    {data.variations.map((v) => {
                      const name = v.name.toLowerCase();
                      return (
                        <Form.Field key={v.id}>
                          <Select
                            name={name}
                            onChange={this.handleChange}
                            placeholder={`Select a ${name}`}
                            fluid
                            selection
                            options={v.item_variations.map((item) => {
                              return {
                                key: item.id,
                                text: item.value,
                                value: item.id,
                              };
                            })}
                            value={formData[name]}
                          />
                        </Form.Field>
                      );
                    })}
                    {isAuthenticated ? (
                      <Form.Button primary>Add</Form.Button>
                    ) : (
                      alert("You are not logged in.")
                    )}
                  </Form>
                </React.Fragment>
              )}
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Try different variations</Header>
              {data.variations &&
                data.variations.map((v) => {
                  if (v.name !== "size") {
                    return (
                      <React.Fragment key={v.id}>
                        <Header as="h3">{v.name}</Header>
                        <Image.Group size="tiny">
                          {v.item_variations.map((iv) => {
                            return (
                              <Image
                                src={`https://ecommerce-shopnow.herokuapp.com${iv.attachment}`}
                                onMouseEnter={() =>
                                  this.setState({
                                    itemImage: `https://ecommerce-shopnow.herokuapp.com${iv.attachment}`,
                                    itemColor: `${iv.value}`,
                                  })
                                }
                                style={{ height: 100, width: 100 }}
                              />
                            );
                          })}
                        </Image.Group>
                        <p>{this.state.itemColor}</p>
                      </React.Fragment>
                    );
                  }
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductDetail)
);
