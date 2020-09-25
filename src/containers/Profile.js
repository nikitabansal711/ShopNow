import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Card,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
  Select,
  Table,
} from "semantic-ui-react";
import {
  countryListURL,
  addressListURL,
  addressCreateURL,
  addressUpdateURL,
  addressDeleteURL,
  userIDURL,
  paymentListURL,
  userProfileUrl,
} from "../constants";
import { authAxios } from "../utils";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

class MyProfile extends React.Component {
  state = {
    err: "",
    loading: "",
    formData: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      date_joined: "",
      birth_date: "",
      country: "",
      contact_number: "",
      about_me: "",
    },
  };

  componentDidMount() {
    this.handleFetchUserData();
  }

  handleFetchUserData = () => {
    authAxios
      .get(userProfileUrl)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        console.log(JSON.stringify(res.data));
        this.setState({
          formData: {
            username: res.data.username,
            email: res.data.email,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            date_joined: res.data.date_joined,
            birth_date: res.data.birth_date,
            country: res.data.country,
            contact_number: res.data.contact_number,
            about_me: res.data.about_me,
            city: res.data.city,
          },
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleSubmit = (e) => {
    const { formData } = this.state;
    console.log(formData);
    authAxios({
      method: "post",
      url: userProfileUrl,
      data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        alert(res.data.status);
      })
      .catch((err) => {});
  };
  handleChange = (e) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  render() {
    const { formData } = this.state;
    return (
      <React.Fragment>
        <Form size="large" onSubmit={this.handleSubmit}>
          <Segment stacked>
            <label htmlFor="userName">
              <strong>Username</strong>
            </label>
            <Form.Input
              id="userName"
              value={formData.username}
              name="username"
              fluid
              icon="user secret"
              iconPosition="left"
              placeholder="User Name"
              style={{ width: "470px" }}
              onChange={this.handleChange}
            />
            <label htmlFor="userFirstName">
              <strong>First Name</strong>
            </label>
            <Form.Input
              id="userFirstName"
              value={formData.first_name}
              name="first_name"
              fluid
              icon="user"
              iconPosition="left"
              placeholder="First Name"
              style={{ width: "470px" }}
              onChange={this.handleChange}
            />
            <label htmlFor="userLastName">
              <strong>Last Name</strong>
            </label>
            <Form.Input
              id="userLastName"
              value={formData.last_name}
              name="last_name"
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Last Name"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userEmail">
              <strong>Email</strong>
            </label>
            <Form.Input
              id="userEmail"
              value={formData.email}
              name="email"
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userCountry">
              <strong>Country</strong>
            </label>
            <Form.Input
              id="userCountry"
              value={formData.country}
              name="country"
              fluid
              icon="home"
              iconPosition="left"
              placeholder="Country"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userCity">
              <strong>City</strong>
            </label>
            <Form.Input
              id="userCity"
              value={formData.city}
              name="city"
              fluid
              icon="home"
              iconPosition="left"
              placeholder="City"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userContactNumber">
              <strong>Contact Number</strong>
            </label>
            <Form.Input
              id="userContactNumber"
              value={formData.contact_number}
              name="contact_number"
              fluid
              icon="phone"
              iconPosition="left"
              placeholder="Contact Number"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userBirthDate">
              <strong>Date Of Birth</strong>
            </label>
            <Form.Input
              id="userBirthDate"
              value={formData.birth_date}
              name="birth_date"
              fluid
              icon="birthday cake"
              iconPosition="left"
              placeholder="Date Of Birth Like 2020-06-18"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <label htmlFor="userAboutMe">
              <strong>About Me</strong>
            </label>
            <Form.Input
              id="userAboutMe"
              value={formData.about_me}
              name="about_me"
              fluid
              icon="man"
              iconPosition="left"
              placeholder="About Me"
              onChange={this.handleChange}
              style={{ width: "470px" }}
            />
            <Button color="teal" fluid style={{ width: "470px" }}>
              Update Profile
            </Button>
          </Segment>
        </Form>
      </React.Fragment>
    );
  }
}

class PaymentHistory extends React.Component {
  state = {
    payments: [],
  };

  componentDidMount() {
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({ loading: true });
    authAxios
      .get(paymentListURL)
      .then((res) => {
        this.setState({
          loading: false,
          payments: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { payments } = this.state;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map((p) => {
            return (
              <Table.Row key={p.id}>
                <Table.Cell>{p.id}</Table.Cell>
                <Table.Cell>₹{p.amount}</Table.Cell>
                <Table.Cell>{new Date(p.timestamp).toUTCString()}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

class AddressForm extends React.Component {
  state = {
    error: null,
    loading: false,
    formData: {
      address_type: "",
      apartment_address: "",
      country: "",
      default: false,
      id: "",
      street_address: "",
      user: 1,
      zip: "",
    },
    saving: false,
    success: false,
  };

  componentDidMount() {
    const { address, formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
  }

  handleToggleDefault = () => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      default: !formData.default,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleChange = (e) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSelectChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [name]: value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSubmit = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .post(addressCreateURL, {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false },
        });
        this.props.callback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleUpdateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .put(addressUpdateURL(formData.id), {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false },
        });
        this.props.callback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  render() {
    const { countries } = this.props;
    const { error, formData, success, saving } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} success={success} error={error}>
        <Form.Input
          required
          name="street_address"
          placeholder="Street address"
          onChange={this.handleChange}
          value={formData.street_address}
        />
        <Form.Input
          required
          name="apartment_address"
          placeholder="Apartment address"
          onChange={this.handleChange}
          value={formData.apartment_address}
        />
        <Form.Field required>
          <Select
            loading={countries.length < 1}
            fluid
            clearable
            search
            options={countries}
            name="country"
            placeholder="Country"
            onChange={this.handleSelectChange}
            value={formData.country}
          />
        </Form.Field>
        <Form.Input
          required
          name="zip"
          placeholder="Zip code"
          onChange={this.handleChange}
          value={formData.zip}
        />
        <Form.Checkbox
          name="default"
          label="Make this the default address?"
          onChange={this.handleToggleDefault}
          checked={formData.default}
        />
        {success && (
          <Message success header="Success!" content="Your address was saved" />
        )}
        {error && (
          <Message
            error
            header="uh on! something went wrong"
            content={JSON.stringify("PLease try again")}
          />
        )}
        <Form.Button disabled={saving} loading={saving} primary>
          Save
        </Form.Button>
      </Form>
    );
  }
}

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    addresses: [],
    countries: [],
    userID: null,
    selectedAddress: null,
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
    this.handleFetchUserID();
  }

  handleItemClick = (name) => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    if (activeItem === "billingAddress") {
      return "Billing Address";
    } else if (activeItem === "shippingAddress") {
      return "Shipping Address";
    } else if (activeItem === "myProfile") {
      return "My Profile";
    }
    return "Payment History";
  };

  handleFormatCountries = (countries) => {
    const keys = Object.keys(countries);
    return keys.map((k) => {
      return {
        key: k,
        text: countries[k],
        value: k,
      };
    });
  };

  handleDeleteAddress = (addressID) => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then((res) => {
        this.handleCallback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = (address) => {
    this.setState({ selectedAddress: address });
  };

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        this.setState({ userID: res.data.userID });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchCountries = () => {
    authAxios
      .get(countryListURL)
      .then((res) => {
        this.setState({ countries: this.handleFormatCountries(res.data) });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    const { activeItem } = this.state;
    authAxios
      .get(addressListURL(activeItem === "billingAddress" ? "B" : "S"))
      .then((res) => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  renderAddresses = () => {
    const {
      activeItem,
      addresses,
      countries,
      selectedAddress,
      userID,
    } = this.state;
    return (
      <React.Fragment>
        <Card.Group>
          {addresses.map((a) => {
            return (
              <Card key={a.id}>
                <Card.Content>
                  {a.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default
                    </Label>
                  )}
                  <Card.Header>
                    {a.street_address}, {a.apartment_address}
                  </Card.Header>
                  <Card.Meta>{a.country}</Card.Meta>
                  <Card.Description>{a.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="yellow"
                    onClick={() => this.handleSelectAddress(a)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => this.handleDeleteAddress(a.id)}
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            countries={countries}
            formType={CREATE_FORM}
            userID={userID}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            userID={userID}
            countries={countries}
            address={selectedAddress}
            formType={UPDATE_FORM}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const { activeItem, error, loading } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Grid container columns={2} divided>
        <Grid.Row columns={1}>
          <Grid.Column>
            {error && (
              <Message
                error
                header="uh oh! seems that you are not logged in"
                content={JSON.stringify("login and please try again")}
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
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <Menu pointing vertical fluid>
              <Menu.Item
                name="My Profile"
                active={activeItem === "myprofile"}
                onClick={() => this.handleItemClick("myProfile")}
              />
              <Menu.Item
                name="Billing Address"
                active={activeItem === "billingAddress"}
                onClick={() => this.handleItemClick("billingAddress")}
              />
              <Menu.Item
                name="Shipping Address"
                active={activeItem === "shippingAddress"}
                onClick={() => this.handleItemClick("shippingAddress")}
              />
              <Menu.Item
                name="Payment history"
                active={activeItem === "paymentHistory"}
                onClick={() => this.handleItemClick("paymentHistory")}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>{this.handleGetActiveItem()}</Header>
            <Divider />
            {activeItem === "paymentHistory" ? (
              <PaymentHistory />
            ) : activeItem === "myProfile" ? (
              <MyProfile />
            ) : (
              this.renderAddresses()
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Profile);
