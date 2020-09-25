import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authForgotConfirm } from "../store/actions/auth";

var currentRoute = window.location.pathname;
var data_list = currentRoute.split("/");
var lowerCaseLetters = /[a-z]/g;
var upperCaseLetters = /[A-Z]/g;
var numbers = /[0-9]/g;

class ForgotFormConfirm extends React.Component {
  state = {
    uid: data_list[3],
    token: data_list[4],
    new_password1: "",
    new_password2: "",
    setRequestSent: false,
  };

  validatorss = (e) => {
    const { new_password1, new_password2 } = this.state;
    if (new_password1 !== new_password2) {
      alert(
        "Passwords don't match, Please enter same password in both fields."
      );
      return false;
    } else if (new_password1.length < 8) {
      alert("Password length atleast 8 or more characters.");
      return false;
    } else if (!new_password1.match(lowerCaseLetters)) {
      alert("Password contain atleast one lower case letter.");
      return false;
    } else if (!new_password1.match(upperCaseLetters)) {
      alert("Password contain atleast one upper case letter.");
      return false;
    }
    if (!new_password1.match(numbers)) {
      alert("Password contain atleast one number.");
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = (e) => {
    const { uid, token, new_password1, new_password2 } = this.state;
    if (this.validatorss()) {
      e.preventDefault();
      this.props.forgotten(uid, token, new_password1, new_password2);
      this.setRequestSent = true;
      alert("Passwords has been changed successfully.");
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { error, loading } = this.props;
    const { new_password1, new_password2 } = this.state;
    if (this.error) {
      return <Redirect to="/" />;
    } else if (this.setRequestSent) {
      return <Redirect to="/" />;
    }
    console.log("this is the erro " + error);
    return (
      <Grid
        textAlign="center"
        style={{ height: "80vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 650 }}>
          <Header as="h2" color="teal" textAlign="center">
            Reset your password.
          </Header>
          {error && <p>{this.props.error.message}</p>}
          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={new_password1}
                  name="new_password1"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="New Password"
                  type="password"
                />
                <Form.Input
                  onChange={this.handleChange}
                  value={new_password2}
                  name="new_password2"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Re New Password"
                  type="password"
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Reset Password
                </Button>
              </Segment>
            </Form>
          </React.Fragment>
          <Message>
            <ul>
              <li>
                {" "}
                Must contain at least{" "}
                <strong style={{ color: "red" }}>one number</strong> and{" "}
                <strong style={{ color: "red" }}> one uppercase</strong> and{" "}
                <strong style={{ color: "red" }}>lowercase letter</strong>, and{" "}
                <strong style={{ color: "red" }}> at least 8 </strong> or more
                characters.
              </li>
            </ul>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotten: (uid, token, new_password1, new_password2) =>
      dispatch(authForgotConfirm(uid, token, new_password1, new_password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotFormConfirm);
