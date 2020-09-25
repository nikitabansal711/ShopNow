import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authForgot } from "../store/actions/auth";


class ForgotForm extends React.Component {
  state = {
    email: "",
    setRequestSent: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email} = this.state;
    this.props.forgotten(email);
    this.setRequestSent = true;
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email} = this.state;
    const { error, loading} = this.props;
    console.log(error);
    if (this.error) {
      return <Redirect to="/forgotpassword" />;
    } else if (this.setRequestSent) {
        return <Redirect to="/emailsent" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "80vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 650 }}>
          <Header as="h2" color="teal" textAlign="center">
            Retrive your password( enter your mail )
          </Header>
          {error && <p>{this.props.error.message}</p>}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={email}
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address - example12@gmail.com"
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Send Confirmation Link
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    forgotten: (email ) =>
      dispatch(authForgot(email))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotForm);
