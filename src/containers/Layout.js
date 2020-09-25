import React from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import shopNowbg from "./images/shopNowbg.jpg";
import { userIDURL } from "../constants";
import { authAxios } from "../utils";


class CustomLayout extends React.Component {
    state = { activeItem: 'home', username: null }
  componentDidMount() {
    this.props.fetchCart();
    this.handleFetchUserID();
  }

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        console.log(res.data);
        this.setState({ username: res.data.username });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  render() {
    const { authenticated, cart, loading } = this.props;
    const { activeItem, username } = this.state;
    return (
      <div
        style={{
          backgroundImage: `url(${shopNowbg})`,
          maxHeight: "600",
          maxWidth: "1",
        }}
      >
        <Segment inverted>
        <Menu inverted pointing secondary>
          <Container>
            {/* <Menu.Item>
             <img src={require('./images/images_1.jpeg')} alt="" style={{ height:25, width:75 }}/>
            </Menu.Item> */}
          <Link to="/">
                <Menu.Item
                  header
                  name='home'
                  active={activeItem === 'home'}
                  onClick={this.handleItemClick}
                >
                  <img src={require('./images/images_1.jpeg')} alt="" style={{ height:25, width:75 }}/>
                </Menu.Item>
            </Link>
            <Link to="/products">
                <Menu.Item
                  header
                  name='products'
                  active={activeItem === 'products'}
                  onClick={this.handleItemClick}
                >
                  Products
                </Menu.Item>
            </Link>
            {authenticated ? (
              <React.Fragment>
                <Menu.Menu position="right">
                  <Dropdown
                    text={ `Hi ${username} `}
                    className="link item"
                    pointing
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => this.props.history.push("/profile")}
                      >
                        Account
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          this.props.history.push("/order-history")
                        }
                      >
                        Order History
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          this.props.history.push("/refundSummary")
                        }
                      >
                        Refunds
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.props.history.push("/display-wishlist")}>
                            Wishlist
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown
                    icon="cart"
                    loading={loading}
                    text={`${cart !== null ? cart.order_items.length : 0}`}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {cart !== null ? (
                        <React.Fragment>
                          {cart.order_items.map((order_item) => {
                            return (
                              <Dropdown.Item key={order_item.id}>
                                {order_item.quantity} x {order_item.item.title}
                              </Dropdown.Item>
                            );
                          })}
                          {cart.order_items.length < 1 ? (
                            <Dropdown.Item>No items in your cart</Dropdown.Item>
                          ) : null}
                          <Dropdown.Divider />

                          <Dropdown.Item
                            icon="arrow right"
                            text="Checkout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item>No items in your cart</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item header onClick={() => this.props.logout()}>
                    Logout
                  </Menu.Item>
                </Menu.Menu>
              </React.Fragment>
            ) : (
              <Menu.Menu position="right">
                <Link to="/login">
                    <Menu.Item
                      header
                      name='login'
                      active={activeItem === 'login'}
                      onClick={this.handleItemClick}
                    >
                      Login
                    </Menu.Item>
                </Link>
                <Link to="/signup">
                    <Menu.Item
                      header
                      name='signup'
                      active={activeItem === 'signup'}
                      onClick={this.handleItemClick}
                    >
                      Signup
                    </Menu.Item>
                </Link>
              </Menu.Menu>
            )}
          </Container>
        </Menu>
        </Segment>

        {this.props.children}

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
        >
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Get to know us" />
                <List link inverted>
                  <List.Item as="a">About Us</List.Item>
                  <List.Item as="a">Careers</List.Item>
                  <List.Item as="a">Press Releases</List.Item>
                  <List.Item as="a">ShopNow Cares</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Connect with us" />
                <List link inverted>
                  <List.Item as="a">Facebook</List.Item>
                  <List.Item as="a">Twitter</List.Item>
                  <List.Item as="a">Instagram</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Let us help you" />
                <List link inverted>
                  <List.Item as="a">100% purchase protection</List.Item>
                  <List.Item as="a">Returns centers</List.Item>
                  <List.Item as="a">Help</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header inverted as="h4" content="Mail us" />
                <p>
                  We are always available to assist you at any time.
                  Please reach out to us, if you need any help.
                </p>
              </Grid.Column>
            </Grid>
            <Divider inverted section />
            <Image centered size="small" src={require('./images/home2.jpeg')} />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      authenticated: state.auth.token !== null,
      cart: state.cart.shoppingCart,
      loading: state.cart.loading,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      logout: () => dispatch(logout()),
      fetchCart: () => dispatch(fetchCart()),
    };
  };
  
  export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
  );
  
