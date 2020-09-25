import React from "react";
import { connect } from "react-redux";
import {
  Container,
  Dimmer,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Button,
  Icon,
  Header, Grid
} from "semantic-ui-react";
import { displayWishlistURL,
    addToCartURL, addWishlistURL
} from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";

class WishList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
    itemData: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    authAxios
      .get(displayWishlistURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  handleClearWishlist = () => {
      authAxios
       .get(addWishlistURL)
       .then(res => {
          window.location.reload(false);
          alert(res.data.status);
       })
  }

  handleAddToCart = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    return (
      <Container>
          <Grid columns={2}>
              <Grid.Row>
                  <Grid.Column>
                      <Header as='h1'
                            style={{color: 'white', 
                            backgroundColor: "lightblue",
                            textAlign: "center",
                            fontFamily: "Arial",
                            padding: (10, 10, 10, 10) }}
                        >
                            Your Wishlist
                        </Header>
                  </Grid.Column>
                  <Grid.Column>
                  <Button
                        negative
                        floated="right"
                        icon
                        labelPosition="right"
                        onClick={() => this.handleClearWishlist()}
                    >
                        Clear Wishlist
                        <Icon name="remove circle" />
                    </Button>
                  </Grid.Column>
              </Grid.Row>
          </Grid>
          
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
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
          {data.map(item => {
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />
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
                  <Item.Meta><strong>Rs. {item.price} only</strong></Item.Meta>
                  <Item.Extra>
                    <Button
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button>
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
                </Item.Content>
              </Item>
            );
          })}
        </Item.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(WishList);
